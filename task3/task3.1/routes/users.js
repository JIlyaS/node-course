const express = require('express');
const router = express.Router();

const ctrlUser = require('../controllers/users');

router.delete('/:id', ctrlUser.delete);

module.exports = router
