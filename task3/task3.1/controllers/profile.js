// const passport = require('passport');

const User = require('../models/User');

module.exports.getProfile = async (req, res, next) => {

  try {
    const user = await User.findById(String(req.user._id)).populate('permission');
    return res.json({
          id: user._id,
          username: user.username,
          firstName: user.firstName,
          surName: user.surName,
          middleName: user.middleName,
          image: '',
          permission: user.permission.permission,
      });
  } catch (err) {
    console.error(err);
  }  
}

module.exports.updateProfile = (req, res, next) => {
  const updateUser = req.body;

  if (updateUser.oldPassword !== updateUser.newPassword) {
    // res.status(400).send('Пароли не совпадают!');
    // next('Пароли не совпадают!', req, res, next);
    // .json({
    //     message: 'Пароли не совпадают.'
    // })
  }
  
  

  User.findByIdAndUpdate(String(req.user._id), updateUser, function (err, user) {
      if (err) {
        console.log(err);
        res.status(400).send('Ошибка обновления данных пользователя!');
      }

      return res.json({
        firstName: user.firstName
      });
  });
}
