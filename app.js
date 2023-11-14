const express = require('express');
const mongoose= require('mongoose');
const app = express();

//static file:
app.use(express.static('public'));

//views:
app.set('view engine','ejs');
app.set('views','./views');

//connecting to the mongoDB:
mongoose.connect('mongodb+srv://saikiranbheempur:saikiranrathod@rathodtest.txfrhmk.mongodb.net/BlogProject?retryWrites=true&w=majority')
    .then((result)=>{
        app.listen(3000)
        console.log('ready to listen to response');
    })
    .catch((err)=>{
        console.log(err);
    })

//middleware : routers:
const blogPresent = require('./middleware/isBlog');
app.use(blogPresent.isBlog);


const adminRouter=require('./routes/adminRouter');
app.use('/',adminRouter);

//userRouter:
const userRouter = require('./routes/userRouter');
app.use('/',userRouter);

const blogRouter=require('./routes/blogRoute');
app.use('/',blogRouter);
