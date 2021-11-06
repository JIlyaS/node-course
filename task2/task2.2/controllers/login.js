const db = require('../models/db')();
const psw = require('../lib/password');

module.exports.auth = async (ctx, next) => {
    const { email, password } = ctx.request.body;

    const user = db.get('user');

  if (user.login === email && psw.validPassword(password)) {
    ctx.session.isAdmin = true
    ctx.redirect('/admin');
  } else {
    ctx.redirect('/login');
  }
}

module.exports.login = async (ctx, next) => {
  if (ctx.session.isAdmin) {
    ctx.redirect('/admin');
  }

  ctx.render('pages/login', { title: 'SigIn page' })
}
