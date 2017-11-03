var mongoose = require('mongoose');
//user Schema
var PostsSchema = mongoose.Schema({
    post_title: String,
    post_content: String,
    post_type: String,
    post_link: {
        type: String,
        unique: true,
        index: true
    },
    category: [{type: mongoose.Schema.Types.ObjectId, ref: 'TaxonomyValues'}],
    custom_field: mongoose.Schema.Types.Mixed,
    post_featured_image: String,
    publish_date: {type: Date, default: Date.now},
    modified_date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Post', PostsSchema);