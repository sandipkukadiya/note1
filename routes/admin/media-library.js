var express = require('express');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var router = express.Router();
var cons = require('../../constants');
var fs = require('fs');
var Post = require('../../models/post');

/* GET Media Library. */
router.get('/media-library', function (req, res, next) {
    res.render('admin/media-library', {title: 'Media Library'});
});

router.post('/upload-files', multipartMiddleware, function (req, res, next) {

    var file = req.files.file;

    var date = convertDateToStr();
    var file_name = date + '_' + file.name;
    fs.readFile(file.path, function (err, data) {
        var newPath = cons.dir + "/public/admin/uploads/" + file_name;
        console.log(newPath);
        fs.writeFile(newPath, data, function (err) {
            if (err) {
                console.log(err);
                res.send(false);
            } else {
                var addAttachmentPost = new Post({
                    post_title: file_name,
                    post_link: "/admin/uploads/" + file_name,
                    post_type: 'attachment'
                });
                addAttachmentPost.save(function (err) {
                    if (!err) {
                        responce = true;
                    } else {
                        responce = false;
                        res.send(err);
                    }
                });
                res.send(addAttachmentPost);
            }
        });
    });

});

module.exports = router;


function convertDateToStr() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!

    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd
    }
    if (mm < 10) {
        mm = '0' + mm
    }
    var today = dd + '-' + mm + '-' + yyyy;

    today = today.split("-");
    var newDate = today[1] + "/" + today[0] + "/" + today[2];
    var date = new Date(newDate).getTime();
    return date;
}