const express = require('express');
const Router = express.Router();

const Post = require('../models/post');

Router.get('/', (req, res, next) => {
    Post.find()
        .then(posts => {
            let renderedPosts = posts.map(post => post.serialize());
            res.render('blog', renderedPosts);
        });
});

module.exports = Router;