const express =require('express');
const userRoute = express.Router();
const bodyParser = require('body-parser');
userRoute.use(bodyParser.json());
userRoute.use(bodyParser.urlencoded({extended:true}));
const userController =require('../controllers/userController');

const session = require('express-session');
const config = require('../config/config');
userRoute.use(session(
    {   cookie:{
        secure: true,
        maxAge:60000
           },
        store: new RedisStore(),
        secret: config.sessionSecret,
        saveUninitialized: true,
        resave: false
    })
);

const userAuth = require('../middleware/adminAuth');


userRoute.get('/login',userAuth.isLogout,userController.loadLogin);
userRoute.post('/login',userController.verifyLogin);
userRoute.get('/logout',userAuth.isLogin,userController.logout);

userRoute.get('/profile',userController.profile);
userRoute.get('/forget-password',userAuth.isLogout,userController.forgetLoad);
userRoute.post('/forget-password',userController.forgetPasswordVerify);
userRoute.get('/reset-password',userAuth.isLogout,userController.resetPasswordLoad);
userRoute.post('/reset-password',userController.resetPassword);




module.exports = userRoute;