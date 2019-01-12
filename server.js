var cors = require('cors')
var jwt = require('express-jwt')
var express = require('express');
var schema = require('./schema');
var express_graphql = require('express-graphql');
var { signin, signup, me, getProduct, getProducts, addProduct, updateProduct, createCart, showCarts, addToCart, cart, checkout, emptyCart, purchase} = require('./resolvers')


var root = {
    signin: signin,
    signup: signup,
    me: me,
    product: getProduct,
    products: getProducts,
    addProduct: addProduct,
    updateProduct: updateProduct,
    createCart: createCart,
    carts: showCarts,
    addToCart: addToCart,
    cart: cart,
    checkout: checkout,
    emptyCart: emptyCart,
    purchase: purchase
};


var auth = jwt({
    secret: process.env.JWT_SECRET,
    credentialsRequired: false
})


var app = express();
app.use('/graphql', auth, cors(), express_graphql((req) => ({
    schema: schema,
    rootValue: root,
    context: { user: req.user },
    graphiql: true
})));


app.listen(8080, () => console.log('Express GraphQL Server Now Running On localhost:8080/graphql'));