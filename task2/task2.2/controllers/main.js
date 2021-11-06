const nodemailer = require('nodemailer');

const db = require('../models/db')();

const config = db.get('mail');

module.exports.main = async (ctx, next) => {

  const { name, email, message } = ctx.request.body;
  console.log("🚀 ~ file: main.js ~ line 10 ~ module.exports.main= ~ ctx.request.body", ctx.request.body)

  if (!name || !email || !message) {
    console.log('111');
    ctx.body = {
      status: 'Error',
      json: {
        msgemail: 'Все поля нужно заполнить!'
      }
    };
  }

  const transporter = nodemailer.createTransport(config.smtp);
  console.log("🚀 ~ file: main.js ~ line 23 ~ module.exports.main= ~ transporter", transporter)
  console.log('222');
  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: config.smtp.auth.user,
    subject: config.subject,
    text: message.trim().slice(0, 500) + 
    `\n Отправлено с <${email}>`
  };

  console.log('333');

  transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        console.log('444');

        ctx.body = {
          msgemail: 'При отправле письма произошла ошибка!',
          status: 'OK'
        }

        // ctx.body = {
        //   status: 'Error',
        //   json: {
        //     msgemail: 'При отправле письма произошла ошибка!'
        //   }
        // };
        // await ctx.render('pages/index', { title: 'Main page', products, skills, msgemail: `При отправле письма произошла ошибка!` })
      }

      // ctx.body = {
      //     status: 'Ok',
      //     json: {
      //       msgemail: 'Письмо успешно отправлено!'
      //     }
      //   };

      console.log('555');

      ctx.body = {
        msgemail: 'Письмо успешно отправлено',
        status: 'OK'
      }
  });
}

module.exports.getMain = async (ctx, next) => {
    const products = db.get('products');
    const skills = db.get('mainSkills');
    const currentSkills = db.get('skills');
    

    skills[0].number = currentSkills.age;
    skills[1].number = currentSkills.concerts;
    skills[2].number = currentSkills.cities;
    skills[3].number = currentSkills.years;

    db.set('mainSkills', skills);
    db.save();
  
    await ctx.render('pages/index', { title: 'Main page', products, skills });
}