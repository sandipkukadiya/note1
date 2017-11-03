var mongoose = require('mongoose');
//user Schema
var TaxonomyValuesSchema = mongoose.Schema({
    title: String,
    description: String,
    parent: String,
    level: Number,
    taxonomy_type: String,
    image: String
});

module.exports = mongoose.model('TaxonomyValues', TaxonomyValuesSchema);