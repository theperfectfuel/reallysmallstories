const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: String,
    content: String,
    headerImg: {
        type: String,
        default: 'https://images.pexels.com/photos/1125273/pexels-photo-1125273.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
    },
    author: {
        firstName: String,
        lastName: String
    },
    created: {
        type: Date, 
        default: Date.now
    },
    upvotes: {
        type: Number,
        default: 0
    }
});

postSchema.virtual('authorName').get(function() {
    return `${this.author.firstName} ${this.author.lastName}`.trim();
});

postSchema.methods.serialize = function() {
    return {
        title: this.title,
        content: this.content,
        headerImg: this.headerImg,
        author: this.authorName,
        id: this._id,
        created: this.created,
        upvotes: this.upvotes
    };
};

module.exports = mongoose.model('Post', postSchema);