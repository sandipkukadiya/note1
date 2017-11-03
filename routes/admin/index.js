var express = require('express');
var router = express.Router();
//var Teams = require('../models/team');
/* GET home page. */
router.get('/', function (req, res, next) {
    if (req.session.email == undefined) {
        res.render('admin/index', {title: 'CMS'});
    } else {
        res.render('admin/members_area', {title: 'CMS'});
    }
});

module.exports = router;
