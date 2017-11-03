var mongoose = require('mongoose');
//option Schema
var OptionsSchema = mongoose.Schema({
    option_key: String,
    option_value: mongoose.Schema.Types.Mixed
});

module.exports = mongoose.model('Option', OptionsSchema);