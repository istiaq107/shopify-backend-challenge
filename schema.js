var { buildSchema } = require('graphql');

module.exports = buildSchema(`

    scalar JSON

    enum Availability {
        All
        Available
    }

    type Query {
        signin(username: String!, password: String!): JSON
        me: JSON
        product(product_id: Int!): Product
        products(availability: Availability): [Product]
        purchase(product_id: Int!): Product
        cart(cart_id: Int): Cart
        carts: [Cart]
    }

    type Mutation {
        signup(username: String!, password: String!, seller_status: Boolean): JSON
        addProduct(title: String!, price: Float!, count: Int!): String
        updateProduct(product_id: Int!, title: String!, price: Float!, count: Int!): String
        createCart: Int
        addToCart(cart_id: Int, product_id: Int!): Cart
        checkout(cart_id: Int): Cart
        emptyCart(cart_id: Int): String
    }

    type Product {
        id: Int
        title: String
        price: Float
        inventory_count: Int
    }

    type Cart {
        id: Int
        items: JSON
        subtotal: Int
    }

`);

