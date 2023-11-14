const express = require('express');
const adminRoute= express.Router();
const adminController= require('../controllers/adminController');
//taking data from the user:
const bodyParser=require('body-parser');
adminRoute.use(bodyParser.json());
adminRoute.use(bodyParser.urlencoded({extended: true}));

const session = require('express-session');
const config = require('../config/config');
adminRoute.use(session(
    {   secret:config.sessionSecret,
        resave: true,
        saveUninitialized:true
    })
);

const adminAuth = require('../middleware/adminAuth');


//images:
const multer = require('multer');
const path = require('path');

//file upload:
const storage = multer.diskStorage({
    destination:(req,file,cb)=> {
        cb(null,path.join(__dirname,'../public/images'))
    },
    filename: (req,file,cb)=>{
        const name = Date.now()+'-'+file.originalname;
        cb(null,name);
    }
});
const upload = multer({ storage: storage});


adminRoute.get('/blog-setup',adminController.blogSetup);
adminRoute.post('/blog-setup',upload.single('blog_image'),adminController.blogSetupSave);
adminRoute.get('/dashboard',adminAuth.isLogin,adminController.dashboard);

adminRoute.get('/create-post',adminAuth.isLogin,adminController.loadpostdashboard);
adminRoute.post('/create-post',adminAuth.isLogin,adminController.addPost);
adminRoute.post('/upload-post-image',upload.single('image'),adminAuth.isLogin,adminController.uploadPostImage)
module.exports=adminRoute;