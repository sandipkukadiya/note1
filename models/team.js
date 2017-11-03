var mongoose = require('mongoose');
var uuid = require("node-uuid");
mongoose.connect('mongodb://localhost/project_management_system');
var db = mongoose.connection;
//user Schema
var UsersSchema = mongoose.Schema({
    team_id: {type: mongoose.Schema.ObjectId, ref: 'Team'}
});
var User = module.exports = mongoose.model('User', UsersSchema);
var CardsSchema = new mongoose.Schema({
    card_name: String,
    card_desc: String,
    card_due_date: Date,
    card_members: {type: mongoose.Schema.ObjectId, ref: 'User'}
});
var Card = module.exports = mongoose.model('Card', CardsSchema);
var ListsSchema = new mongoose.Schema({
    list_name: String,
    list_desc: String,
    list_cards: {type: mongoose.Schema.ObjectId, ref: 'Card'}
});
var List = module.exports = mongoose.model('List', ListsSchema);
var BoardsSchema = new mongoose.Schema({
    board_name: String,
    board_desc: String,
    board_members: {type: mongoose.Schema.ObjectId, ref: 'User'},
    lists: {type: mongoose.Schema.ObjectId, ref: 'List'}
});
var Board = module.exports = mongoose.model('Board', BoardsSchema);
var TeamsSchema = new mongoose.Schema({
    is_personnel: String,
    team_name: String,
    team_desc: String,
    team_members: {type: mongoose.Schema.ObjectId, ref: 'User'},
    boards: {type: mongoose.Schema.ObjectId, ref: 'Board'}
});
var Team = module.exports = mongoose.model('Team', TeamsSchema);

module.exports.createBoard = function (newBoard, callback) {
    // Create Board
    newBoard.save(callback);
};