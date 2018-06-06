const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: String,
    content: String,
    author: {
        firstName: String,
        lastName: String
    },
    created: {
        type: Date, 
        default: Date.now
    }
});

postSchema.virtual('authorName').get(function() {
    return `${this.author.firstName} ${this.author.lastName}`.trim();
});

postSchema.methods.serialize = function() {
    return {
        title: this.title,
        content: this.content,
        author: this.authorName,
        id: this._id,
        created: this.created
    };
};

module.exports = mongoose.model('Post', postSchema);