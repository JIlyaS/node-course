const path = require('path');
const fs = require('fs');

const db = require('../models/db');

module.exports.skills = (req, res, next) => {

    const { age, concerts, cities, years } = req.body;
    const skills = db.get('skills');
    skills.push({
        age,
        concerts,
        cities,
        years
    });

    db.set('skills', skills);

    /* eslint-disable node/handle-callback-err */
    db.save(function (err) {
        fs.readFileSync(path.join(__dirname, '../models/config.json'));
    });

    res.redirect('back');
}

module.exports.getAdmin = (req, res, next) => {
    let skills = db.get('skills');
    console.log("🚀 ~ file: admin.js ~ line 29 ~ skills", skills)

    if (!skills.length) {
        skills = [{
          age: '',
          concerts: '',
          cities: '',
          years: ''
        }]
    }

    res.render('pages/admin', { title: 'Admin page', age: skills[0].age, concerts: skills[0].concerts, cities: skills[0].cities, years: skills[0].years  })
}
