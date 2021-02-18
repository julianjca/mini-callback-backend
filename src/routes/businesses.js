const express = require('express');
const router = express.Router();

const { getAll, create,update } = require('../controllers/businesses')

router.get('/', getAll);
router.post('/', create);
router.put('/:id', update);

module.exports = router;
