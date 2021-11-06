const express = require('express')
const passport = require('passport');
const router = express.Router()

const ctrlProfile = require('../controllers/profile');
// const isAdmin = require('../lib/isAdmin');

router.get('/', passport.authenticate('jwt', { session: false }), ctrlProfile.getProfile)

router.patch('/', passport.authenticate('jwt', { session: false }), ctrlProfile.updateProfile)

// router.get("/secretDebug",
//   function(req, res, next){
//     console.log(req.get('Authorization'));
//     next();
//   }, function(req, res){
//     res.json("debugging");
// });

module.exports = router
