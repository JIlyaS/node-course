const Router = require('koa-router');
const koaBody = require('koa-body');

const router = new Router();

// const isAdmin = require('../lib/isAdmin');

const ctrlAdmin = require('../controllers/admin');
const ctrlLogin = require('../controllers/login');
const ctrlMain = require('../controllers/main');

router.get('/admin', ctrlAdmin.getAdmin)

router.post('/admin/skills', ctrlAdmin.skills)

router.post('/admin/upload', ctrlAdmin.upload)

router.get('/login', ctrlLogin.login)

router.post('/login', ctrlLogin.auth);

router.get('/', ctrlMain.getMain)

router.post('/', koaBody(), ctrlMain.main)

module.exports = router

