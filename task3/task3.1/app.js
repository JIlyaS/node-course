const path = require('path');
const fs = require('fs');

const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  allowEIO3: true
});

const morgan = require('morgan');
const cons = require('consolidate');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const passportJWT = require('passport-jwt');
const session = require('express-session');
const mongoose = require('mongoose');

const User = require('./models/User');

const clients = {};

io.on("connection", (socket) => {
  // console.log("🚀 ~ file: app.js ~ line 25 ~ io.on ~ socket", socket)
  // socket.emit('users:connect', 'hi from server io!');
  socket.on("users:connect", (user) => {
    clients[socket.id] = {
      username: user.username,
      socketId: socket.id,
      userId: user.userId,
      activeRoom: null
    };
  });

  socket.on("message:add", (message) => {
    socket.emit("message:add", message); // ?
  });

  socket.emit("users:list", Object.values(clients));
  socket.broadcast.emit('users:add', clients[socket.id]);

  // socket.on("users:leave", (user) => {
  //   console.log("🚀 ~ file: app.js ~ line 46 ~ socket.on ~ user", user)
  // })

  socket.on('disconnect', () => {
    delete clients[socket.id];
    socket.emit('users:leave', clients[socket.id]);
  });
});

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

server.listen(process.env.PORT || 3000, async () => {

  // Создание папки upload, если её нет
  // const upload = path.join('./public', 'upload');

  // if (!fs.existsSync(upload)) {
  //   fs.mkdirSync(upload);
  // }

  console.log('Сервер запущен на порте: ' + server.address().port);
})
