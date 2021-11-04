const User = require('../models/User');

module.exports.delete = (req, res, next) => {
    const userId  = req.params.id;

    User.findByIdAndDelete(userId, (err, user) => {
      if (err) {
        console.log(err);
        // return handleError(err);
      }
      res.json({ data: true });
    });
}