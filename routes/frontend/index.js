var express = require('express');
var router = express.Router();
var Post = require('../../models/post');    
/* GET home page. */

router.get('/', function (req, res, next) {

    res.render('theme/index', {title: 'Blog'});

});
router.get('/category/:value', function (req, res, next) {
    var value = req.params.value;
    var data = {title: 'Blog', value: value};
    res.render('theme/archive', data);

});
router.get('/post/:slug', function (req, res, next) {
    res.render('theme/single', {title: 'Blog'});
});


module.exports = router;
