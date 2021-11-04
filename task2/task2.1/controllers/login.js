const db = require('../models/db')();
const psw = require('../lib/password');

module.exports.auth = (req, res, next) => {
    const { email, password } = req.body;

    const user = db.get('user');

  if (user.login === email && psw.validPassword(password)) {
    req.session.isAdmin = true
    res.redirect('/admin');
  } else {
    res.redirect('/login');
  }
}

module.exports.login = (req, res, next) => {
  console.log("🚀 ~ file: login.js ~ line 11 ~ req.session", req.session)
  if (req.session.isAdmin) {
    res.redirect('/admin');
  }

  res.render('pages/login', { title: 'SigIn page' })
}
