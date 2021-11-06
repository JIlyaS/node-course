const path = require('path');
const fs = require('fs');

const Koa = require('koa');
const serve = require('koa-static');
// const createError = require('http-errors');
const morgan = require('koa-morgan');
// const koaBody = require('koa-body');
const Pug = require('koa-pug');

const db = require('./models/db')();
const psw = require('./lib/password');
const errorHandler = require('./lib/error');

const router = require('./routes');

const app = new Koa();

// eslint-disable-next-line no-unused-vars
const pug = new Pug({
  viewPath: path.resolve(__dirname, './views'),
  pretty: false,
  basedir: path.resolve(__dirname, './views'),
  noCache: true,
  app: app, // equals to pug.use(app) and app.use(pug.middleware)
});

app.use(serve('./public'));

const accessLogStream = fs.createWriteStream(path.join(__dirname, '/mylog.log'), { flags: 'a' })
app.use(morgan('combined', { stream: accessLogStream }));

process.env.NODE_ENV === 'development'
  ? app.use(morgan('dev'))
  : app.use(morgan('short'));

  // app.use(koaBody());

  app.use(errorHandler);

// app.use(session({
//   secret: 'node-course',
//   key: 'sessionkey',
//   cookie: {
//     path: '/',
//     httpOnly: true,
//     maxAge: 24 * 60 * 60 * 1000
//   },
//   saveUninitialized: false,
//   resave: false
// }));

// app.use(express.static(path.join(__dirname, 'public')));



// eslint-disable-next-line node/handle-callback-err
app.on('error', (err, ctx) => {
  console.log('123');
  ctx.response.body = {}
  ctx.render('error', {
    status: ctx.response.status,
    error: ctx.response.message,
  });
});

// app.use((req, __, next) => {
//   next(
//     createError(404, `Ой, извините, но по пути ${req.url} ничего не найдено!`)
//   )
// })

// app.use((err, req, res, next) => {
//   // set locals, only providing error in development
//   res.locals.message = err.message
//   res.locals.error = req.app.get('env') === 'development' ? err : {}

//   // render the error page
//   res.status(err.status || 500)
//   res.render('error')
// })

app
  // .use(session(config.session, app))
  .use(router.routes())
  .use(router.allowedMethods());

const server = app.listen(process.env.PORT || 3000, async () => {

  // Создание папки upload, если её нет
  const upload = path.join('./public', 'upload');

  if (!fs.existsSync(upload)) {
    fs.mkdirSync(upload);
  }

  const login = process.env.LOGIN;
  const pass = process.env.PASSWORD;
  const objPassword = psw.setPassword(pass)
  const hash = objPassword.hash;
  const salt = objPassword.salt;

  db.set('user:login', login);
  db.set('user:hash', hash);
  db.set('user:salt', salt);

  /* eslint-disable node/handle-callback-err */
  await db.save(function (err) {
    if (err) {
      console.error(err.message);
      return;
    }
    fs.readFileSync(path.join(__dirname, './models/config.json'));
  });

  console.log('Сервер запущен на порте: ' + server.address().port);
})
