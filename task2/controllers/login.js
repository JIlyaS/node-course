const db = require('../models/db');
const psw = require('../lib/password');

module.exports.auth = (req, res, next) => {
    const { email, password } = req.body;

    console.log('req.session.isAdmin', req.session.isAdmin);

    const user = db.get('user');

  if (user.login === email && psw.validPassword(password)) {
    req.session.isAdmin = true
    // ctx.body = {
    //   mes: 'Done',
    //   status: 'OK'
    // }
    res.redirect('/admin');
  } else {
    // ctx.body = {
    //   mes: 'Forbiden',
    //   status: 'Error'
    // }
    res.redirect('/login');
  }
}

module.exports.login = (req, res, next) => {
  if (req.session.isAdmin) {
    res.redirect('/admin');
  }

  res.render('pages/login', { title: 'SigIn page' })
}
