const express = require('express');
const router = express.Router();

const { getAll, create,update } = require('../controllers/businesses')
const authenticateJWT = require('../middlewares/auth')

router.get('/', authenticateJWT, getAll);
router.post('/', authenticateJWT, create);
router.put('/:id', authenticateJWT, update);

module.exports = router;
