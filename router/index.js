const items = require('./routers/items');
const carts = require('./routers/cart');
const categoies = require('./routers/category')

module.exports = (app) => {
    app.use('/items', items);
    app.use('/carts', carts);
    app.use('/categoies', categoies);

};