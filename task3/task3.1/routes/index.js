const express = require('express');
const router = express.Router();

router.use('/login', require('./login'));
router.use('/registration', require('./registration'));
router.use('/refresh-token', require('./refresh-token'));
router.use('/profile', require('./profile'));
router.use('/users', require('./users'));
router.use('/news', require('./news'));

module.exports = router;
