var express = require('express');
var router = express.Router();
var Option = require('../../models/option');

/* GET home page. */
router.get('/add-post', function (req, res, next) {
    
    var id = req.query.id;
    
    var post_type = req.query.post_type;
    
    if (id === undefined) {
        var data = {
            title: 'Add ' + post_type.ucfirst(),
            submit_btn: 'Publish'
        };
    } else {
        var data = {
            title: 'Edit ' + post_type.ucfirst(),
            id: id,
            submit_btn: 'Update'
        };
    }
    res.render('admin/add-post', data);
});

router.get('/all-posts', function (req, res, next) {

    var post_type = req.query.post_type;
    //post_type = post_type.plural().ucfirst();
    res.render('admin/all-posts', {title: 'All '});
});

router.get('/taxonomy', function (req, res, next) {
    var taxonomy = req.query.type;
    res.render('admin/taxonomy', {title: taxonomy});
});

router.get('/custom-post', function (req, res, next) {
    var id = req.query.id;

    if (id === undefined) {
        var data = {
            title: 'Add Custom Post',
            submit_btn: 'Publish'
        };
    } else {
        var data = {
            title: 'Edit Custom Post',
            id: id,
            submit_btn: 'Update'
        };
    }
    res.render('admin/add-custom-post', data);
});

router.get('/all-custom-post', function (req, res, next) {
    res.render('admin/all-custom-post', {title: 'All Custom Post'});
});


module.exports = router;
String.prototype.ucfirst = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};
String.prototype.plural = function (revert) {

    var plural = {
        '(quiz)$': "$1zes",
        '^(ox)$': "$1en",
        '([m|l])ouse$': "$1ice",
        '(matr|vert|ind)ix|ex$': "$1ices",
        '(x|ch|ss|sh)$': "$1es",
        '([^aeiouy]|qu)y$': "$1ies",
        '(hive)$': "$1s",
        '(?:([^f])fe|([lr])f)$': "$1$2ves",
        '(shea|lea|loa|thie)f$': "$1ves",
        'sis$': "ses",
        '([ti])um$': "$1a",
        '(tomat|potat|ech|her|vet)o$': "$1oes",
        '(bu)s$': "$1ses",
        '(alias)$': "$1es",
        '(octop)us$': "$1i",
        '(ax|test)is$': "$1es",
        '(us)$': "$1es",
        '([^s]+)$': "$1s"
    };

    var singular = {
        '(quiz)zes$': "$1",
        '(matr)ices$': "$1ix",
        '(vert|ind)ices$': "$1ex",
        '^(ox)en$': "$1",
        '(alias)es$': "$1",
        '(octop|vir)i$': "$1us",
        '(cris|ax|test)es$': "$1is",
        '(shoe)s$': "$1",
        '(o)es$': "$1",
        '(bus)es$': "$1",
        '([m|l])ice$': "$1ouse",
        '(x|ch|ss|sh)es$': "$1",
        '(m)ovies$': "$1ovie",
        '(s)eries$': "$1eries",
        '([^aeiouy]|qu)ies$': "$1y",
        '([lr])ves$': "$1f",
        '(tive)s$': "$1",
        '(hive)s$': "$1",
        '(li|wi|kni)ves$': "$1fe",
        '(shea|loa|lea|thie)ves$': "$1f",
        '(^analy)ses$': "$1sis",
        '((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$': "$1$2sis",
        '([ti])a$': "$1um",
        '(n)ews$': "$1ews",
        '(h|bl)ouses$': "$1ouse",
        '(corpse)s$': "$1",
        '(us)es$': "$1",
        's$': ""
    };

    var irregular = {
        'move': 'moves',
        'foot': 'feet',
        'goose': 'geese',
        'sex': 'sexes',
        'child': 'children',
        'man': 'men',
        'tooth': 'teeth',
        'person': 'people'
    };

    var uncountable = [
        'sheep',
        'fish',
        'deer',
        'series',
        'species',
        'money',
        'rice',
        'information',
        'equipment'
    ];

    // save some time in the case that singular and plural are the same
    if (uncountable.indexOf(this.toLowerCase()) >= 0)
        return this;

    // check for irregular forms
    for (word in irregular) {

        if (revert) {
            var pattern = new RegExp(irregular[word] + '$', 'i');
            var replace = word;
        } else {
            var pattern = new RegExp(word + '$', 'i');
            var replace = irregular[word];
        }
        if (pattern.test(this))
            return this.replace(pattern, replace);
    }

    if (revert)
        var array = singular;
    else
        var array = plural;

    // check for matches using regular expressions
    for (reg in array) {

        var pattern = new RegExp(reg, 'i');

        if (pattern.test(this))
            return this.replace(pattern, array[reg]);
    }

    return this;
}