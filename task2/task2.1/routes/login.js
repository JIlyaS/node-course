const express = require('express');
const router = express.Router();

const ctrlLogin = require('../controllers/login');

router.get('/', ctrlLogin.login)

router.post('/', ctrlLogin.auth);

module.exports = router
