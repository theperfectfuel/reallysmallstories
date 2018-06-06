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

Router.post('/', (req, res, next) => {
    Post.create({
      title: req.body.title,
      author: {firstName: req.body.firstName, lastName: req.body.lastName},
      content: req.body.content
    })
    .then(post => {
        res.render('blog', post);
    })
    .catch(err => {
        console.log(err);
    })
});

module.exports = Router;