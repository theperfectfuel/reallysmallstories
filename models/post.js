const mongoose = require('mongoose');

const postSchema = new Schema({
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

postSchema.virtual('authorName', function get() {
    return this.author.firstName + " " + this.author.lastName;
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