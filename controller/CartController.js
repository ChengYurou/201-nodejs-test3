const Cart = require('../model/cart');
const async = require('async');

class CartController {
  getAll(req, res, next) {
    async.series({
      items: (done) => {
        Cart.find({})
            .populate('items')
            .exec((err, docs) => {
              if (err) {
                return next(err);
              }
              const data = docs.map(cart => {

                return cart.toJSON().items.map(({count, item}) => {
                  return {uri: `items/${item}`, count};
                });

              });
              done(null, data);
            })
      },
      totalCount: (done) => {
        Cart.count(done)
      }
    }, (err, docs) => {
      if (err) {
        return next(err);
      }
      return res.status(200).send(docs);
    })
  }

  getOne(req, res, next) {
    Cart.findById(req.params.cartId, (err, doc) => {
      if (!doc) {
        return res.sendStatus(404);
      }
      if (err) {
        return next(err);
      }
      const data = doc.toJSON().items.map(({count,item}) => {

        return {uri: `items/${item}`, count};
      });
      return res.status(200).send(doc);
    })
  }

  create(req, res, next) {
    Cart.create(req.body, (err, doc) => {
      if (err) {
        return next(err);
      }
      return res.status(201).send({uri: `carts/${doc._id}`});
    })
  }

  delete(req, res, next) {
    Cart.findByIdAndRemove(req.params.cartId, (err, doc) => {
      if (!doc) {
        return res.sendStatus(404)
      }
      if (err) {
        return next(err);
      }
      return res.sendStatus(204);
    })
  }

  update(req, res, next) {
    Cart.findByIdAndUpdate(req.params.cartId, req.body, (err, doc) => {
      if (!doc) {
        return res.sendStatus(404)
      }
      if (err) {
        return next(err);
      }
      return res.sendStatus(204);
    })
  }
}

module.exports = CartController;
