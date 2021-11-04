const express = require('express')
const router = express.Router()

const ctrlrefreshToken = require('../controllers/refresh-token');

router.post('/', ctrlrefreshToken.refresh)

module.exports = router