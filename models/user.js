var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/project_management_system');
var db = mongoose.connection;
//user Schema
var UsersSchema = mongoose.Schema({
    first_name: {
        type: String
    },
    last_name: {
        type: String
    },
    email: {
        type: String,
        index: true
    },
    password: {
        type: String
    }
});

var User = module.exports = mongoose.model('User', UsersSchema);

module.exports.getUserById = function (id, callback) {
    User.findById(id, callback);
};

module.exports.getUserByEmail = function (email, callback) {
    var query = {email: email};
    User.findOne(query, callback);
};

module.exports.createUser = function (newUser, callback) {
    // Create User
    newUser.save(callback);
};