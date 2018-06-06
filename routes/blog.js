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
    });
});

Router.delete('/:id', (req, res, next) => {
    Post.findByIdAndRemove(req.params.id)
        .then(post => res.render('blog', {message: 'Post successfully removed'}))
        .catch(err => {
            res.render('blog', {message: `Error deleting post: ${err}`})
        });
});

module.exports = Router;