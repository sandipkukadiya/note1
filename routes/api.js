    var express = require('express');
var router = express.Router();
var _ = require('underscore-node');
var User = require('../models/user');
var Post = require('../models/post');
var Option = require('../models/option');
var Taxonomy = require('../models/taxonomy');
const util = require('util');
/*
 * Users collection API Requests 
 */
var responce = '';
router.get('/users', function (req, res) {
    User.find({}, function (err, data) {
        res.send(data);
    });
});
router.get('/users/:id', function (req, res) {
    var id = req.params.id;
    User.findById(id, function (err, result) {
        res.send(result);
    });
});
router.post('/user', function (req, res) {
    var newUser = new User(req.body);
    newUser.save(function (err) {
        if (!err) {
            responce = true;
        } else {
            responce = false;
        }
        res.send(responce);
    });
});
router.put('/user/:id', function (req, res) {
    User.findById(req.params.id, function (err, updateUser) {

        updateUser = req.body;
        updateUser.update(function (err) {
            if (!err) {
                responce = true;
            } else {
                responce = false;
            }
            res.send(responce);
        });
    });
});
router.delete('/user/:id', function (req, res) {
    User.findById(req.params.id, function (err, user) {
        user.remove(function (err) {
            if (!err) {
                responce = true;
            } else {
                responce = false;
            }
            res.send(responce);
        });
    });
});
/*
 * posts collection API Requests 
 */
router.get('/posts', function (req, res) {
    
    var query_params = {};
    if (_.size(req.query) > 0) {

        query_params = req.query;
        /* like operation*/
        if (query_params.hasOwnProperty("comparison")) {
            query_params = {
                post_link: {
                    $regex: query_params['post_link']
                }
            };
        }
    }
    console.log(query_params);
    Post.find(query_params, function (err, data) {
        if (!err) {
            res.send(data);
        } else {
            res.send(err);
        }

    });
});
router.get('/post/:id', function (req, res) {
    var id = req.params.id;
    Post.findById(id, function (err, result) {
        if (!err) {
            responce = true;
        } else {
            responce = false;
            res.send(err);
        }

        res.send(result);
    });
});
router.get('/posts/byCategory/:id', function (req, res) {
    var id = req.params.id;
    console.log(id);
    Post.find({
        category: id
    }).populate('category')
            .exec(function (err, result) {
                if (!err) {
                    responce = true;
                } else {
                    responce = false;
                    res.send(err);
                }
                res.send(result);
            });
});
router.post('/post', function (req, res) {
    var newPost = new Post(req.body);
    newPost.save(function (err) {
        if (!err) {
            responce = true;
            newPost.on('index', function (err) {
                console.log(err);
            });
        } else {
            responce = false;
            res.send(err);
        }
        res.send(responce);
    });

});
router.put('/post/:id', function (req, res) {
    Post.findById(req.params.id, function (err, updatePost) {

        if (!err) {
            if (!updatePost) {
                updatePost = new Post();
            }

            Object.assign(updatePost, req.body);

            var responce = {};
            updatePost.save(function (err) {
                if (!err) {
                    responce = true;
                    updatePost.on('index', function (err) {
                        console.log(err);
                    });
                } else {
                    responce = false;
                }
                res.send(responce);
            });
        }
    });
});
router.delete('/post/:id', function (req, res) {
    Post.findById(req.params.id, function (err, post) {
        post.remove(function (err) {
            if (!err) {
                responce = true;
            } else {
                responce = false;
            }
            res.send(responce);
        });

    });
});

/*
 * option collection API Requests 
 */
router.get('/option', function (req, res) {

    var query_params = {};
    if (_.size(req.query) > 0) {
        query_params = req.query;
    }

    Option.find(query_params, function (err, data) {

        if (!err) {
            res.send(data);
        } else {
            res.send(err);
        }

    });
});
router.get('/option/:id', function (req, res) {
    var id = req.params.id;
    Option.findById(id, function (err, result) {
        res.send(result);
    });
});
router.post('/option', function (req, res) {

    var newOption = new Option(req.body);
    newOption.save(function (err) {
        if (!err) {
            responce = true;
        } else {
            responce = false;
        }
        res.send(responce);
    });
});
router.put('/option/:id', function (req, res) {
    Option.findById(req.params.id, function (err, updateOption) {
        if (!err) {
            if (!updateOption) {
                updateOption = new Option();
            }

            Object.assign(updateOption, req.body);

            var responce = {};
            updateOption.save(function (err) {
                if (!err) {
                    responce = true;
                } else {
                    responce = false;
                }
                res.send(responce);
            });
        }
    });
});
router.delete('/option/:id', function (req, res) {
    Option.findById(req.params.id, function (err, option) {
        option.remove(function (err) {
            if (!err) {
                responce = true;
            } else {
                responce = false;
            }
            res.send(responce);
        });

    });
});


/*
 * taxonomy collection API Requests 
 */
router.get('/taxonomies', function (req, res) {
   
  
    var query_params = {};
    if (_.size(req.query) > 0) {
        query_params = req.query;
    }
    
    Taxonomy.find(query_params, function (err, data) {
        if (!err) {
            res.send(data);
        } else {
            res.send(err);
        }
    });
});
router.get('/taxonomy/:id', function (req, res) {
    var id = req.params.id;
    Taxonomy.findById(id, function (err, result) {
        res.send(result);
    });
});
router.post('/taxonomy', function (req, res) {

    var newTaxonomy = new Taxonomy(req.body);
    newTaxonomy.save(function (err) {
        if (!err) {
            responce = true;
        } else {
            responce = false;
        }
        res.send(responce);
    });
});
router.put('/taxonomy/:id', function (req, res) {
    Taxonomy.findById(req.params.id, function (err, updateTaxonomy) {
        if (!err) {
            if (!updateTaxonomy) {
                updateTaxonomy = new Taxonomy();
            }
            console.log(updateTaxonomy);
            Object.assign(updateTaxonomy, req.body);
            console.log(updateTaxonomy);
            var responce = {};
            updateTaxonomy.save(function (err) {
                if (!err) {
                    responce = true;
                } else {
                    responce = false;
                }
                res.send(responce);
            });
        }
    });
});
router.delete('/taxonomy/:id', function (req, res) {
    Taxonomy.findById(req.params.id, function (err, taxonomy) {
        taxonomy.remove(function (err) {
            if (!err) {
                responce = true;
            } else {
                responce = false;
            }
            res.send(responce);
        });

    });
});
module.exports = router;