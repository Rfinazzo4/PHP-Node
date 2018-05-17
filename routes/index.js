var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/storeData', function(req, res, next)
{
    res.render('index', { title: 'Express' });
});

module.exports = router;

//now processing post
router.post('/storeData', function(req, res, next) {
//expecting data variable called order--retrieve value using body-parser
    var order = req.body.order;
//retrieve the data associated with order

    res.send("order succesfully received: " + order);
});
