const path = require('path');
const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const cons = require('consolidate');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const passportJWT = require('passport-jwt');
const session = require('express-session');
const mongoose = require('mongoose');

// const io = require('socket.io').listen(8000);

const User = require('./models/User');

const uri = 'mongodb://localhost:27017/mongo-auth';

mongoose.connect(uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  // useCreateIndex: true
});

const connection = mongoose.connection;

connection.once('open', function () {
  console.log('MongoDB connected successfully');
});

const FileStore = require('session-file-store')(session);

const JWTStrategy = passportJWT.Strategy;
// const ExtractJWT = passportJWT.ExtractJwt;


// const createError = require('http-errors');

const mainRouter = require('./routes/')

const app = express();

app.use(session({
  store: new FileStore(),
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user)
  });
});

passport.use(new LocalStrategy({
  usernameField: 'username',
}, (username, password, done) => {
  User.findOne({ username: username}).then((user) => {
    if (!user) {
      done(null, false, { message: 'Invalid username / password'});
    }
    user.comparePassword(password, (err, matched) => {
      if (err) {
        throw err;
      }

      if (matched) {
        done(null, user);
      } else {
        done(null, false, { message: 'Invalid username / password'});
      }
    });
  });
}));

passport.use(new JWTStrategy({
  jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'jwt_secret'
}, (jwtPayload, done) => {
  User.findById(jwtPayload.user._id, (err, user) => done(err, user));
}))

app.engine('html', cons.swig)
app.set('views', path.join(__dirname, 'client', 'build'));
app.set('view engine', 'html');

process.env.NODE_ENV === 'development'
  ? app.use(morgan('dev'))
  : app.use(morgan('short'));

  const log = fs.createWriteStream('mylog.log', { flags: 'a' });

  app.use(morgan('combined', { stream: log }));

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'client', 'build')));

app.use('/api', mainRouter)

app.get('*', (req, res) => {
  // res.render('index.html');
  return res.sendFile(path.join(__dirname, '/client/build/index.html'));
});

// io.sockets.on('connection', (socket) => {
//   socket.emit('users:connect', 'hi from server io');
// });


// catch 404 and forward to error handler
// app.use((req, __, next) => {
//   next(
//     createError(404, `Ой, извините, но по пути ${req.url} ничего не найдено!`)
//   )
// })

app.use((err, req, res, next) => {
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.send(err.message)
})

const server = app.listen(process.env.PORT || 3000, async () => {

  // Создание папки upload, если её нет
  // const upload = path.join('./public', 'upload');

  // if (!fs.existsSync(upload)) {
  //   fs.mkdirSync(upload);
  // }

  console.log('Сервер запущен на порте: ' + server.address().port);
})
