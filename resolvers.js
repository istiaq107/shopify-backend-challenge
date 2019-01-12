var { Client } = require('pg');
var bcrypt = require('bcrypt')
var jsonwebtoken = require('jsonwebtoken')


db = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PWD
});
db.connect()


///////////////// auth resolvers /////////////////
var signin = async function({ username, password }) {
    user_query = await db.query('SELECT * FROM users WHERE username = $1', [username])
    user = user_query.rows[0]
    if (!user) {
        throw new Error('No user with that id')
    }
    var valid = bcrypt.compareSync(password, user.password_hash)
    if (!valid) {
        throw new Error('Incorrect password')
    }
    return {"x-access-token": jsonwebtoken.sign({id: user.id, username: user.username, seller_status: user.seller_status}, process.env.JWT_SECRET, {expiresIn: '1y'})}
}


var signup = async function({ username, password, seller_status }) {
    user_query = await db.query('SELECT * FROM users WHERE username = $1', [username])
    user = user_query.rows[0]
    if (user) {
        throw new Error(`username ${username} is unavailable`)
    }
    var hash = bcrypt.hashSync(password, 10);
    return db.query('INSERT INTO users (username, password_hash, seller_status) VALUES ($1, $2, $3) RETURNING id', [username, hash, seller_status])
        .then(({ id }) => {
            return {"x-access-token": jsonwebtoken.sign({id: id, user: username, seller_status: seller_status}, process.env.JWT_SECRET, {expiresIn: '1y'})}
        });
}

var me = function(args, { user }) {
    return user
}


///////////////// product resolvers /////////////////
var getProduct = function({ product_id }) {
    return db.query('SELECT * FROM products WHERE id=$1', [product_id]).then((res) => {
        if (res.rowCount) return res.rows[0]
        throw new Error("Invalid product id")
    })
}

var getProducts = function({ availability }) {
    filter = availability=='All' ? '' : ' WHERE inventory_count>0'
    return db.query(`SELECT * FROM products ${filter}`).then((res) => res.rows)
}

var addProduct = async function({ title, price, count}, { user }) {
    if (!user || !user.seller_status) throw new Error("buyers cannot add products")
    product_query = await db.query('SELECT * FROM products WHERE title=$1', [title])
    if (product_query.rowCount) {
        throw new Error('product exists')
    } else {
        db.query('INSERT INTO products (title, price, inventory_count) VALUES ($1, $2, $3)', [title, price, count]).then((res) => res.rows[0])
        return "product added"
    }
}

var updateProduct = async function({ product_id, title, price, count }, { user }) {
    if (!user || !user.seller_status) throw new Error("buyers cannot add products")
    product_query = await db.query('SELECT * FROM products WHERE id=$1', [product_id])
    if (!product_query.rowCount) {
        throw new Error('product does not exist')
    } else {
        db.query('UPDATE products SET title=$1, price=$2, inventory_count=$3 WHERE id=$4', [title, price, count, product_id])
        return "product updated"
    }
}


///////////////// cart resolvers /////////////////
var addToCart = async function({ cart_id, product_id }, { user }) {
    var table = "users"
    if (user) id = user.id
    if (cart_id != null && user) throw new Error('http://tny.im/hcL')
    if (cart_id != null) { 
        table = "carts"
        id = cart_id
    }
    var item_query = await db.query('SELECT * FROM products WHERE id=$1', [product_id]);
    var item = item_query.rows[0]
    if (!item["inventory_count"]) throw new Error('product inventory is empty')
    var query = await db.query(`SELECT * FROM ${table} WHERE id=$1`, [id])
    var query_rows = query.rows[0]
    var cart_items = query_rows["cart_items"]
    var cart_subtotal = query_rows["cart_subtotal"]
    if (cart_items[item["title"]]) {
        ++cart_items[item["title"]]
    } else {
        cart_items[item["title"]] = 1
    }
    cart_subtotal += item["price"]
    db.query(`UPDATE ${table} SET cart_items=$1::json, cart_subtotal=$2::integer WHERE id=$3`, [cart_items, cart_subtotal, id])
    return {"items": cart_items, "subtotal": cart_subtotal}
}

var createCart = function() {
    return db.query('INSERT INTO carts (cart_items, cart_subtotal) VALUES (\'{}\', 0.0) RETURNING id').then(res => res.rows[0]["id"])
}

var showCarts = function() {
    return db.query('SELECT id as id, cart_items as items, cart_subtotal as subtotal FROM carts').then((res) => res.rows)
}

var cart = function({ cart_id }, { user }) {
    if (cart_id != null && user) throw new Error('http://tny.im/hcL')
    if (cart_id != null) return db.query('SELECT id as id, cart_items as items, cart_subtotal as subtotal FROM carts WHERE id = $1', [cart_id]).then((res) => res.rows[0])
    return db.query('SELECT id as id, cart_items as items, cart_subtotal as subtotal FROM users WHERE id = $1', [user.id]).then((res) => res.rows[0])
}

var checkout = async function(args, ctx) {
    if (args.cart_id != null && args.user) throw new Error('http://tny.im/hcL')
    cart_query = await cart(args, ctx)
    cart_items = cart_query["items"]
    for (var item in cart_items) {
        itemCount = cart_items[item]
        db.query('UPDATE products SET inventory_count = inventory_count - $1 WHERE title=$2', [itemCount, item])
    }
    emptyCart(args, ctx)
    return cart_query
}

var emptyCart = function({ cart_id }, { user }) {
    if (cart_id != null && user) throw new Error('http://tny.im/hcL')
    if (cart_id != null) db.query('UPDATE carts SET cart_items = \'{}\', cart_subtotal=0 WHERE id=$1', [cart_id])
    if (user != null) db.query('UPDATE users SET cart_items = \'{}\', cart_subtotal=0 WHERE id=$1', [user.id])
    return "carts emptied"
}

var purchase = function({ product_id }) {
    return db.query('SELECT * FROM products WHERE id=$1', [product_id]).then((res) => {
        if (res.rowCount == 0) throw new Error("invalid product id")
        count = res.rows[0]["inventory_count"]
        if (count > 0) {
            return db.query('UPDATE products SET inventory_count = inventory_count - 1 WHERE id=$1 RETURNING id, title, price, inventory_count', [product_id]).then((res) => {return res.rows[0]})
        } else {
            throw new Error("product has no inventory")
        }
    })
}


module.exports = { signin, signup, me, getProduct, getProducts, addProduct, updateProduct, addToCart, cart, createCart, showCarts, checkout, emptyCart, purchase }