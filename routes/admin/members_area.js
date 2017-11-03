var express = require('express');
var router = express.Router();
//var User = require('../models/team');

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});
router.get('/members_area', function (req, res, next) {
    res.render('members_area', {
        title: 'members_area'
    });
});