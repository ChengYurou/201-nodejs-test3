const Category = require('../model/category');
const Item = require('../model/item');
const async = require('async');

class CategoryController {
  getAll(req, res, next) {
    async.series({
      items: (done) => {
        Category.find({}, done)
      },
      totalCount: (done) => {
        Category.count(done)
      }
    }, (err, docs) => {
      if (err) {
        return next(err);
      }
      return res.status(200).send(docs);
    })
  }

  getOne(req, res, next) {
    Category.findById(req.params.categoryId, (err, doc) => {
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
    Category.create(req.body, (err, doc) => {
      if (err) {
        return next(err);
      }
      return res.status(201).send({uri: `categories/${doc._id}`});
    })
  }

  delete(req, res, next) {
    const categoryId = req.params.categoryId
    async.waterfall([
      (done) => {
        Category.findByIdAndRemove(categoryId, done)
      },
      (doc, done) => {
        if (!doc) {
          return done({status: 404}, null);
        }
        Item.find({category: categoryId}, done)
      }, (docs, done) => {
        async.map(docs, (item, callback) => {
          Item.remove(item, callback);
        }, done)
      },

    ], (err) => {
      if(err && err.status){
        return res.sendStatus(404)
      }
      if (err) {
        return next(err);
      }
      return res.sendStatus(204);
    })
  }

  update(req, res, next) {
    Category.findByIdAndUpdate(req.params.categoryId, req.body, (err, doc) => {
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

module.exports = CategoryController;
