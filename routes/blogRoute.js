const express = require('express');
const blogRoute = express.Router();
const blogController = require('../controllers/blogController');

blogRoute.get('/',blogController.loadBlog);
blogRoute.get('/blog/:id',blogController.loadPost);
blogRoute.post('/add-comment',blogController.addComment);
blogRoute.post('/do-reply',blogController.doReply);


module.exports=blogRoute;