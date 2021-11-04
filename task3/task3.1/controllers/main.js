// const nodemailer = require('nodemailer');

// const db = require('../models/db')();

// const config = db.get('mail');

// module.exports.main = (req, res, next) => {

//     const { name, email, message } = req.body;
//   if (!name || !email || !message) {
//     return res.json({
//         msgemail: 'Все поля нужно заполнить!',
//         status: 'Error'
//     });
//   }

//   const transporter = nodemailer.createTransport(config.smtp);
//   const mailOptions = {
//     from: `"${name}" <${email}>`,
//     to: config.smtp.auth.user,
//     subject: config.subject,
//     text: message.trim().slice(0, 500) + 
//     `\n Отправлено с <${email}>`
//   };

//   transporter.sendMail(mailOptions, function (error, info) {
//       if (error) {
//         console.log(error)
//         return res.json({
//             msgemail: `При отправле письма произошла ошибка!`,
//             status: 'Error'
//         });
//       }

//       return res.json({
//             msgemail: `Письмо успешно отправлено!`,
//             status: 'Ok'
//       });

//     // res.render('pages/index', { title: 'Main page', products, skills, msgemail: `Письмо успешно отправлено!` })
//   });
// }

// module.exports.getMain = (req, res, next) => {
//     const products = db.get('products');
//     const skills = db.get('mainSkills');
//     const currentSkills = db.get('skills');
    

//     skills[0].number = currentSkills.age;
//     skills[1].number = currentSkills.concerts;
//     skills[2].number = currentSkills.cities;
//     skills[3].number = currentSkills.years;

//     db.set('mainSkills', skills);
//     db.save();
  
//     res.render('pages/index', { title: 'Main page', products, skills })
// }