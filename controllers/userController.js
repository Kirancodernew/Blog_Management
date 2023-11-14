const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const randomstring=require('randomstring');
const config = require('../config/config');
const { response } = require('express');
const adminController=require('./adminController')


const sendResetPasswordMail = async(name,email,token)=>{
    try {
        const transport=nodemailer.createTransport({
            host: "smtp-mail.outlook.com", // hostname
            secureConnection: false, // TLS requires secureConnection to be false
            port: 587, // port for secure SMTP
            auth: {
                user: config.mailUser,
                pass: config.mailPassword
            },
            tls: {
                ciphers:'SSLv3'
            }
        });
        const mailOption={
            from:config.mailUser,
            to:email,
            subject:"Reset Password",
            html:'<p>Hi '+name+', Please click here to <a href="http://localhost:3000/reset-password?token='+token+'">Reset</a> Your Password.'
        }
        transport.sendMail(mailOption,function(error,info){
            if(error){
                console.log(error);
            }else{
                console.log("Email has been send:- ",info.response);
            }
        });
    } catch (error) {
        console.log(error.message);
    }
};


const loadLogin = async(req,res)=>{
    try {
        res.render('login');
    } catch (error) {
        console.log(error.message);
    }
};
const verifyLogin = async(req,res)=>{
    try {
        const email = req.body.email;
        const password = req.body.password;
        const userData = await User.findOne({email:email});
        if(userData){
            const passwordMatch=await bcrypt.compare(password,userData.password);
            if(passwordMatch){
                req.session.user_id = userData._id;
                req.session.is_admin = userData.is_admin;
                if(userData.is_admin==1){
                    res.redirect('/dashboard');
                }else{
                    res.redirect('/profile');
                }
            }else{
                res.render('login',{message: "Email and Password is incorrect!"});
            }
        }else{
            res.render('login',{message:"Email and Password is incorrect!"});
        }
    } catch (error) {
        console.log(error.message);
    }
}
const profile = async(req,res)=>{
    try {
        res.render('Hii profile is here');
    } catch (error) {
        console.log(error.message);
    }
};
const logout = async(req,res)=>{
    try {
        req.session.destroy();
        res.redirect('/login');
    } catch (error) {
        console.log(error.message);
    }
}
const forgetLoad = async(req,res)=>{
    try {
        res.render('forget-password');
    } catch (error) {
        console.log(error.message);
    }
}
const forgetPasswordVerify = async(req,res)=>{
    try {
        const email=req.body.email;
        const userData =await User.findOne({email:email});
        if(userData){
            const randstring =randomstring.generate();
            await User.updateOne({ email:email},{ $set:{ token: randstring}});
            sendResetPasswordMail(userData.name,userData.email,randstring);
            res.render('forget-password',{message:"Check you email"});
        }else{
            res.render('forget-password',{message:"Email is Incorrect"});
        }

    } catch (error) {
        console.log(error.message);
    }
}


const resetPasswordLoad=async(req,res)=>{
    try {
        const token=req.query.token;
        const tokenData = await User.findOne({token:token});
        if(tokenData){
            res.render('reset-password',{user_id:tokenData._id});
        }else{
            res.render('404');
        }

    } catch (error) {
        console.log(error.message)
    }
}
 const resetPassword= async(req,res)=>{
    try {
        const password=req.body.password;
        const user_id = req.body.user_id;
        const securePassword=await adminController.securePassword(password);
        await User.findByIdAndUpdate({_id:user_id},{$set:{password:securePassword,token:""}})
        res.redirect('/login');
    } catch (error) {
        console.log(error.message)
    }
 }








module.exports = {
    loadLogin,
    verifyLogin,
    profile,
    logout,
    forgetLoad,
    forgetPasswordVerify,
    resetPasswordLoad,
    resetPassword
};