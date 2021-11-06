const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/user-test', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    // useCreateIndex: true
}, function (err) {
  if (err) {
    throw err;
  }
  console.log('Successfully connected to MongoDB');
});

const testUser = new User({
    username: 'test_user',
    password: 'password123'
});

testUser.save((err) => {
  if (err) {
    throw err;
  }

  User.findOne({ username: 'test_user'}, (err, user) => {
    if (err) {
        throw err;
    }

    user.comparePassword('password123', (err, isMatch) => {
      if (err) {
        throw err;
      }
      console.log('password123', isMatch);
    });

    user.comparePassword('some-password', (err, isMatch) => {
      if (err) {
        throw err;
      }
      console.log('some-password', isMatch);
    });
  });
});