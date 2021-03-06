const Item = require('../model/item');
const async = require('async');

class ItemController {
  getAll(req, res, next) {
    async.series({
      items: (done) => {
        Item.find({}, done)
      },
      totalCount: (done) => {
        Item.count(done)
      }
    }, (err, docs) => {
      if (err) {
        return next(err);
      }
      return res.status(200).send(docs);
    })
  }

  getOne(req, res, next) {
    Item.findById(req.params.itemId, (err, doc) => {
      if (!doc) {
        return res.sendStatus(404);
      }
      if (err) {
        return next(err);
      }
      return res.status(200).send(doc);
    })
  }

  create(req, res, next) {
    Item.create(req.body, (err, doc) => {
      if (err) {
        return next(err);
      }
      return res.status(201).send({uri: `items/${doc._id}`});
    })
  }

  delete(req, res, next) {
    Item.findByIdAndRemove(req.params.itemId, (err, doc) => {
      if(!doc) {
        return res.sendStatus(404)
      }
      if (err) {
        return next(err);
      }
      return res.sendStatus(204);
    })
  }

  update(req, res, next) {
    Item.findByIdAndUpdate(req.params.itemId, req.body, (err, doc) => {
      if(!doc) {
        return res.sendStatus(404)
      }
      if (err) {
        return next(err);
      }
      return res.sendStatus(204);
    })
  }
}

module.exports = ItemController;
