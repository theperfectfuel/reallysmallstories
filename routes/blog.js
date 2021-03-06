const express = require('express');
const Router = express.Router();

const Post = require('../models/post');

Router.get('/', (req, res, next) => {
    Post.find().sort({created: -1})
        .then(posts => {
            let renderedPosts = posts.map(post => post.serialize());
            res.render('blogs', {posts: renderedPosts, user: req.user});
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
    let userId;
    if (!req.user) {
        userId = false;
    } else {
        userId = req.user.id;
    }
    Post.findById(req.params.id)
        .then(post => {
            let userMatch = (userId == post.userId);
            let renderedPost = post.serialize();
            res.render('blog', {post: renderedPost, user: req.user, userMatch: userMatch});
        });
});

Router.get('/update/:id', (req, res, next) => {
    Post.findById(req.params.id)
        .then(post => {
            let renderedPost = post.serialize();
            res.render('update-post', {post: renderedPost, user: req.user});
        });
});

Router.post('/', (req, res, next) => {
    userId = req.user.id;
    Post.create({
      title: req.body.title,
      author: {firstName: req.body.firstName, lastName: req.body.lastName},
      content: req.body.content,
      headerImg: req.body.headerImg,
      userId: userId
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
        content: req.body.content
    }})
        .then(post => {
            res.redirect(`/blog/${post.id}`);
        })
        .catch(err => {
            res.render('blog', {message: `Error updating post: ${err}`, user: req.user});
        });
});

Router.put('/upvote/:id', (req, res, next) => {
    Post.findByIdAndUpdate(req.params.id, {$inc: {
        upvotes: 1
    }})
        .then(post => {
            res.redirect(`/blog/${post.id}`);
        })
        .catch(err => {
            res.render('blog', {message: `Error updating post: ${err}`, user: req.user});
        });
});

Router.delete('/:id', (req, res, next) => {
    Post.findByIdAndRemove(req.params.id)
        .then(post => res.redirect('/blog'))
        .catch(err => {
            res.render('blog', {message: `Error deleting post: ${err}`, user: req.user})
        });
});

module.exports = Router;