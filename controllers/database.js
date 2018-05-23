var express = require('express');
var router = express.Router();

var mongodb = require('mongodb');
var mongoDBURI = process.env.MONGODB_URI || 'mongodb://Rfinazzo4:Rio-fizzo4@ds225840.mlab.com:25840/heroku_hnqdq9m4';

//to process data sent in on request need body-parser module
var bodyParser = require('body-parser');
var path = require('path'); //to work with separtors on any OS including Windows

var querystring = require('querystring'); //for use in GET Query string of form URI/path?name=value

router.use(bodyParser.json()); // for parsing application/json
router.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencode


module.exports.storeData = function (req, res, next) {

    var customer_info =[];
    var billing_info =[];
    var shipment_info =[];

    //READ IN POST CUSTOMER INFO
    customer_info['name1'] = req.body.firstname;
    customer_info['name2'] = req.body.lastname;
    customer_info['add1'] = req.body.addy;
    customer_info['city'] = req.body.city;
    customer_info['state'] = req.body.state;
    customer_info['zipcode'] = req.body.zip;
    customer_info['email'] = req.body.email;

    //READ IN POST BILLING INFO
    billing_info['ctype'] = req.body.ctype;
    billing_info['cnum'] = req.body.cnum;
    billing_info['cdate'] = req.body.cdate;

    //READ IN POST SHIPPING INFO
    shipment_info['add1'] = req.body.addy;
    shipment_info['city'] = req.body.city;
    shipment_info['state'] = req.body.state;
    shipment_info['zipcode'] = req.body.zip;

    //READ IN POST ORDERS INFO
    var product_vector=req.body.PRODUCT_VECTOR;
    var total = req.body.ordertotal;


    mongodb.MongoClient.connect(mongoDBURI, function (err, client) {
        if (err) throw err;
        /**************************************************************************
         * IMPORTANT:  this is how you generate  a random number for  3IDs that
         * you will need for the collections cusomerID, billinID and   shippingID
         *    WHY?  the retrieve _id  info after and  insert (see below)  does not seem
         *     to function properly on Heroku
         *    so to know the ID we simply generate it in code  rather than
         *     autogenerate it for the documents we newly insert into the CUSOTMERS, BILLING, SHIPPING
         *      for ORDERS we allow the system to autogenerate its  _id
         */
        // Try MongoDB in replace of db *******
        var theDatabase = client.db('heroku_hnqdq9m4'); //set database


        var customerID = Math.floor((Math.random() * 1000000000000) + 1);
        var billingID = Math.floor((Math.random() * 1000000000000) + 1);
        var shippingID = Math.floor((Math.random() * 1000000000000) + 1);
        var day = new Date();

        //customer collection operation
        var CUSTOMERS = theDatabase.collection('CUSTOMERS');
        /*CUSTOMERS.deleteMany({}, function (err, result) {
        if (err) throw err;
        });*/
        var customerdata = {
            _id: customerID,
            FIRSTNAME: customer_info['name1'],
            LASTNAME: customer_info['name2'],
            STREET: customer_info['add1'],
            CITY: customer_info['city'],
            STATE: customer_info['state'],
            ZIP: customer_info['zipcode'],
            EMAIL: customer_info['email'],
        };
        CUSTOMERS.insertOne(customerdata, function (err, result) {
            if (err) throw err;
        });


        //Billing collection operation

        var BILLING = theDatabase.collection('BILLING');
        /*BILLING.deleteMany({}, function (err, result) {
        if (err) throw err;
        });*/
        var billingdata = {
            _id: billingID,
            CUSTOMER_ID: customerID,
            CREDITCARDTYPE: billing_info['ctype'],
            CREDITCARDNUM: billing_info['cnum'],
            CREDITCARDEXP: billing_info['cdate'],
        };
        BILLING.insertOne(billingdata, function (err, result) {
            if (err) throw err;
        });

        //Shipping collection operation
        var SHIPPING = theDatabase.collection('SHIPPING');
        /*SHIPPING.deleteMany({}, function (err, result) {
        if (err) throw err;
        });*/
        var shippingdata = {
            _id: shippingID,
            CUSTOMER_ID: customerID,
            SHIPPING_STREET: shipment_info['add1'],
            SHIPPING_CITY: shipment_info['city'],
            SHIPPING_STATE: shipment_info['state'],
            SHIPPING_ZIP: shipment_info['zipcode'],
        };
        SHIPPING.insertOne(shippingdata, function (err, result) {
            if (err) throw err;
        });

        //ORDERS collection operation
        var ORDERS = theDatabase.collection('ORDERS');
        /*ORDERS.deleteMany({}, function (err, result) {
        if (err) throw err;
        });*/
        var orderdata = {
            _id: shippingID,
            CUSTOMER_ID: customerID,
            BILLING_ID: billingID,
            SHIPPING_ID: shippingID,
            DATE: day,
            PRODUCT_VECTOR: product_vector,
            ORDER_TOTAL: total,
        };
        ORDERS.insertOne(orderdata, function (err, result) {
            if (err) throw err;
        });


    })

};

module.exports.getAllOrders =  function (request, response) {

    mongodb.MongoClient.connect(mongoDBURI, function (err, client) {
        if (err) throw err;


        //get handle to the databse
        var theDatabase = client.db('heroku_hnqdq9m4');


        //get collection of routes
        var Routes = theDatabase.collection('Order');


        //SECOND -show another way to make request for ALL Routes  and simply collect the  documents as an
        //   array called docs that you  forward to the  getAllRoutes.ejs view for use there
        Routes.find().toArray(function (err, docs) {
            if (err) throw err;

            response.render('getAllOrders', {results: docs});

        });

        //close connection when your app is terminating.
        client.close(function (err) {
            if (err) throw err;
        });
    });//end of connect
};