// const path = require('path');
// const fs = require('fs');
// const formidable = require('formidable');

// const db = require('../models/db')();

// module.exports.skills = (req, res, next) => {

//     const { age, concerts, cities, years } = req.body;

//     if (!age || !concerts || !cities || !years) {
//       res.render('pages/admin', { 
//         title: 'Admin page',
//         age: '',
//         concerts: '',
//         cities: '',
//         years: '',
//         msgskill: 'Не все поля заполнены!'
//       });
//     }

//     const newSkills = {
//       age,
//       concerts,
//       cities,
//       years
//     }

//     db.set('skills', newSkills);

//     /* eslint-disable node/handle-callback-err */
//     db.save(function (err) {

//         if (err) {
//           res.render('pages/admin', { 
//             title: 'Admin page',
//             age: '',
//             concerts: '',
//             cities: '',
//             years: '',
//             msgskill: 'Ошибка сохранения данных!'
//           });
//         }

//         fs.readFileSync(path.join(__dirname, '../models/config.json'));
//     });

//     res.render('pages/admin', { 
//         title: 'Admin page',
//         age: age,
//         concerts: concerts,
//         cities: cities,
//         years: years,
//         msgskill: 'Данные успешно загружены!'
//     });
// }

// module.exports.getAdmin = (req, res, next) => {
//     const skills = db.get('skills');

//     res.render('pages/admin', { 
//         title: 'Admin page',
//         age: skills.age,
//         concerts: skills.concerts,
//         cities: skills.cities,
//         years: skills.years,
//         msgfile: req.query.msg,
//     });
// }


// module.exports.upload = (req, res, next) => {
//     const products = db.get('products');
//     const form = new formidable.IncomingForm();
//     const upload = path.join('./public', 'upload');

//     form.uploadDir = path.join(process.cwd(), upload);

//     form.parse(req, function (err, fields, files) {
//         if (err) {
//             return next(err);
//         }

//         const valid = validation(fields, files);

//         if (valid.err) {
//           fs.unlinkSync(files.photo.path);
//           return res.redirect(`/admin?msg=${valid.status}`);
//         }
        
//         const fileName = path.join(process.cwd(), 'public/assets/img/products/', files.photo.name);
        
//         fs.rename(files.photo.path, fileName, function (err) {
//           if (err) {
//             console.error(err.message);
//             return;
//           }

//           products.push({
//               "src": path.join('./assets/img/products/', files.photo.name),
//               "name": fields.name,
//               "price": Number(fields.price)
//           });
//           db.set('products', products);
//           db.save();
//         res.redirect('/admin?msg=Картинка успешно загружена');
//       });
//     });
// };


// const validation = (fields, files) => {
//   if (files.photo.name === '' || files.photo.size === 0) {
//     return { status: 'Не загружена картинка!', err: true };
//   }

//   if (!fields.name) {
//     return { status: 'Не указано описание картинки!', err: true };
//   }

//   if (!fields.price) {
//     return { status: 'Не указана цена!', err: true };
//   }

//   return { status: 'ok', err: false };
// }