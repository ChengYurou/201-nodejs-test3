const {Router} = require('express');
const CategoryController = require('../../controller/CategoryController');


const router = Router();
const actegoryCtrl = new CategoryController();

router.get('/', actegoryCtrl.getAll);
router.get('/:categoryId', actegoryCtrl.getOne);
router.post('/', actegoryCtrl.create);
router.delete('/:categoryId', actegoryCtrl.delete);
router.put('/:categoryId', actegoryCtrl.update);

module.exports =  router;