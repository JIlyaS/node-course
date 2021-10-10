const path = require('path');
const fs = require('fs');

const createError = require('http-errors');
const express = require('express');
const morgan = require('morgan');
const session = require('express-session');

const db = require('./models/db');
const psw = require('./lib/password');

const mainRouter = require('./routes/')

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

process.env.NODE_ENV === 'development'
  ? app.use(morgan('dev'))
  : app.use(morgan('short'));

  const log = fs.createWriteStream('mylog.log', { flags: 'a' });

  app.use(morgan('combined', { stream: log }));

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(session({
  secret: 'node-course',
  key: 'sessionkey',
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  },
  saveUninitialized: false,
  resave: false
}));

app.use(express.static(path.join(__dirname, 'public')))

app.use('/', mainRouter)

// catch 404 and forward to error handler
app.use((req, __, next) => {
  next(
    createError(404, `Ой, извините, но по пути ${req.url} ничего не найдено!`)
  )
})

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

const server = app.listen(process.env.PORT || 3000, () => {
  const login = process.env.LOGIN;
  const pass = process.env.PASSWORD;
  const objPassword = psw.setPassword(pass)
  const hash = objPassword.hash;
  const salt = objPassword.salt;

  db.set('user:login', login);
  db.set('user:hash', hash);
  db.set('user:salt', salt);
  // console.log(path.join(__dirname, '../models/config.json'));

  /* eslint-disable node/handle-callback-err */
  db.save(function (err) {
    fs.readFileSync(path.join(__dirname, '/models/config.json'));
  });
  console.log('Сервер запущен на порте: ' + server.address().port);
})
