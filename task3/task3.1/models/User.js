const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');

const SALT_WORK_FACTOR = 10;

const UserSchema = new Schema({
    username: { type: String, required: true, index: { unique: true }},
    password: { type: String, required: true},
    surName: { type: String},
    firstName: { type: String},
    middleName: { type: String},
    image: { type: String },
    permission: {
        type: Schema.Types.ObjectId,
        ref: 'Permission'
    },
}); 


UserSchema.pre('save', function (next) {
  const user = this;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) {
      return next(err);
    }

    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) {
        return next(err);
      }
        user.password = hash;
        next();
    });
  });
});

UserSchema.methods.comparePassword = function (candidatePassword, next) {
  bcrypt.compare(candidatePassword, this.password, function (err, same) {
    if (err) {
      return next(err);
    }

    next(null, same);
  });
}

module.exports = mongoose.model('User', UserSchema);