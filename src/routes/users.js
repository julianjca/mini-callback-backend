const express = require('express');
const router = express.Router();

const { login, create, authenticate } = require('../controllers/users')

router.post('/login', login);
router.post('/', create);
router.get('/authenticate', authenticate);

module.exports = router;
