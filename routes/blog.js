const express = require('express');
const Router = express.Router();

const Post = require('../models/post');

Router.get('/', (req, res, next) => {
    Post.find().sort({created: -1})
        .then(posts => {
            let renderedPosts = posts.map(post => post.serialize());
            res.render('blogs', {posts: renderedPosts});
        });
});

// API ENDPOINT RETURNING ONLY JSON FOR TESTING
Router.get('/api', (req, res, next) => {
    Post.find().sort({created: -1})
        .then(posts => {
            let renderedPosts = posts.map(post => post.serialize());
            res.json(renderedPosts);
        });
});

Router.get('/:id', (req, res, next) => {
    Post.findById(req.params.id)
        .then(post => {
            let renderedPost = post.serialize();
            res.render('blog', {post: renderedPost});
        });
});

Router.post('/', (req, res, next) => {
    Post.create({
      title: req.body.title,
      author: {firstName: req.body.firstName, lastName: req.body.lastName},
      content: req.body.content,
      headerImg: req.body.headerImg
    })
    .then(post => {
        res.redirect('/blog');
    })
    .catch(err => {
        console.log(err);
    });
});

Router.put('/:id', (req, res, next) => {
    Post.findByIdAndUpdate(req.params.id, {$set: {
        title: req.body.title,
        content: req.body.content,
        headerImg: req.body.headerImg
    }})
        .then(post => {
            res.render('blog', {post: post, message: `Successfully updated post`});
        })
        .catch(err => {
            res.render('blog', {message: `Error updating post: ${err}`});
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