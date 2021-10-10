const express = require('express')
const router = express.Router()

const ctrlAdmin = require('../controllers/admin');
const isAdmin = require('../lib/isAdmin');

router.get('/', isAdmin, ctrlAdmin.getAdmin)

router.post('/skills', isAdmin, ctrlAdmin.skills)

router.post('/upload', isAdmin, (req, res, next) => {
  /* TODO:
   Реализовать сохранения объекта товара на стороне сервера с картинкой товара и описанием
    в переменной photo - Картинка товара
    в переменной name - Название товара
    в переменной price - Цена товара
    На текущий момент эта информация хранится в файле data.json  в массиве products
  */
  res.send('Реализовать сохранения объекта товара на стороне сервера')
})

module.exports = router
