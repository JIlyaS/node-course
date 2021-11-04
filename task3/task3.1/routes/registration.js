const express = require('express');
const router = express.Router();

const ctrlReg = require('../controllers/registration');

router.post('/', ctrlReg.reg);

module.exports = router
