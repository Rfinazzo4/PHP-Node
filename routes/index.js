var express = require('express');
var router = express.Router();

module.exports = router;

//now processing post
router.post('/storeData', function(req, res, next) {
//expecting data variable called order--retrieve value using body-parser
    var ordercart = req.body.order;
//retrieve the data associated with order

    res.send("order succesfully received: " + ordercart);
});
