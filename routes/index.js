var express = require('express');
var router = express.Router();

//LOAD the various controllers
var controllerMongoCollection = require('../controllers/database'); //load controller code dealing with database mongodb and Routes collection

var mongodb = require('mongodb');
var mongoDBURI = process.env.MONGODB_URI || 'mongodb://Rfinazzo4:Rio-fizzo4@ds225840.mlab.com:25840/heroku_hnqdq9m4';

//**************************************************************************
//***** mongodb get all of the Routes in Routes collection where frequence>=1
//      and sort by the name of the route.  Render information in the views/pages/mongodb.ejs
router.post('/getAllOrders', function (request, response) {

    mongodb.MongoClient.connect(mongoDBURI, function(err,  client) {
        if(err) throw err;
        //get handle to the database
        var theDatabase = client.db('heroku_hnqdq9m4');

        router.get('/getAllOrders', function(req, res, next)
        {

            res.render('index', { title: 'Express' });
        });


        //get collection of Routes
        var Routes = theDatabase.collection('Routes');
        //get all Routes
        Routes.find({ }).sort({ name: 1 }).toArray(function (err, docs) {
            if(err) throw err;

            response.render('mongodb', {results: docs});

        });

        //close connection when your app is terminating.
        client.close(function (err) {
            if(err) throw err;
        });
    });//end of connect

});//end XXX.get

//CODE to route /getAllRoutes to appropriate  Controller function
//**************************************************************************
//***** mongodb get all of the Routes in Routes collection w
//      and Render information iwith an ejs view
router.get('/getAllOrders', controllerMongoCollection.getAllOrders);

module.exports = router;
