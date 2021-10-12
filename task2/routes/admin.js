const express = require('express')
const router = express.Router()

const ctrlAdmin = require('../controllers/admin');
const isAdmin = require('../lib/isAdmin');

router.get('/', isAdmin, ctrlAdmin.getAdmin)

router.post('/skills', isAdmin, ctrlAdmin.skills)

router.post('/upload', isAdmin, ctrlAdmin.upload)

module.exports = router
