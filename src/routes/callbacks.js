const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const { getAll, create } = require('../controllers/callbacks')

/* GET home page. */
router.get('/', getAll);
router.post('/', 
  body('virtual_account').exists(), 
  body('bank_code').exists(),
  body('timestamp').exists(),
  body('transaction_id').exists(),
  body('business_id').exists(),
  create,
);

module.exports = router;
