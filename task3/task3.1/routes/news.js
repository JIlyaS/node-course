const express = require('express');
const passport = require('passport');

const router = express.Router();

const ctrlNews = require('../controllers/news');

router.get('/', passport.authenticate('jwt', { session: false }), ctrlNews.getNews);

router.post('/', passport.authenticate('jwt', { session: false }), ctrlNews.addNews);

router.patch('/:id', passport.authenticate('jwt', { session: false }), ctrlNews.updateNews);

router.delete('/:id', passport.authenticate('jwt', { session: false }), ctrlNews.deleteNews);

module.exports = router