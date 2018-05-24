
var mongodb = require('mongodb');
var mongoDBURI = process.env.MONGODB_URI || 'mongodb://Rfinazzo4:Rio-fizzo4@ds225840.mlab.com:25840/heroku_hnqdq9m4';

module.exports.storeData = function (req, res) {

    //READ IN POST CUSTOMER INFO

    var firstn = req.body.firstname;
    var lastn = req.body.lastname;
    var address = req.body.addy;
    var city = req.body.city;
    var stat = req.body.state;
    var zip = req.body.zip;
    var email = req.body.email;

    //READ IN POST BILLING INFO
    var cardtype = req.body.ctype;
    var cardnum = req.body.cnum;
    var carddate = req.body.cdate;

    //READ IN POST SHIPPING INFO
    var shipaddy = req.body.addy;
    var shipcity = req.body.city;
    var shipstate = req.body.state;
    var shipzip = req.body.zip;

    //READ IN POST ORDERS INFO
    var product_vector=req.body.PRODUCT_VECTOR;
    var total = req.body.ordertotal;

        res.send("What I got was: " + firstn + " "+lastn);


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


        var theDatabase = client.db('heroku_hnqdq9m4'); //set database


        var customerID = Math.floor((Math.random() * 1000000000000) + 1);
        var billingID = Math.floor((Math.random() * 1000000000000) + 1);
        var shippingID = Math.floor((Math.random() * 1000000000000) + 1);
        var day = new Date();

        //customer collection operation
        var CUSTOMERS = theDatabase.collection('CUSTOMERS');


        var customerdata = {
            _id: customerID,
            FIRSTNAME: firstn,
            LASTNAME: lastn,
            STREET: address,
            CITY: city,
            STATE: stat,
            ZIP: zip,
            EMAIL: email
        };


        CUSTOMERS.insertOne(customerdata, function (err, result) {
            if (err) throw err;
        });

        //Billing collection operation

        var BILLING = theDatabase.collection('BILLING');

        var billingdata = {
            _id: billingID,
            CUSTOMER_ID: customerID,
            CREDITCARDTYPE: cardtype,
            CREDITCARDNUM: cardnum,
            CREDITCARDEXP: carddate
        };
        BILLING.insertOne(billingdata, function (err, result) {
            if (err) throw err;
        });

        //Shipping collection operation
        var SHIPPING = theDatabase.collection('SHIPPING');

        var shippingdata = {
            _id: shippingID,
            CUSTOMER_ID: customerID,
            SHIPPING_STREET: shipaddy,
            SHIPPING_CITY: shipcity,
            SHIPPING_STATE: shipstate,
            SHIPPING_ZIP: shipzip
        };
        SHIPPING.insertOne(shippingdata, function (err, result) {
            if (err) throw err;
        });

        //ORDERS collection operation
        var ORDERS = theDatabase.collection('ORDERS');

        var orderdata = {
            _id: shippingID,
            CUSTOMER_ID: customerID,
            BILLING_ID: billingID,
            SHIPPING_ID: shippingID,
            DATE: day,
            PRODUCT_VECTOR: product_vector,
            ORDER_TOTAL: total
        };
        ORDERS.insertOne(orderdata, function (err, result) {
            if (err) throw err;
        });

        Routes.find().toArray(function (err, docs) {
            if (err) throw err;

            res.render('storeData', {results: docs});

        });

    })

};

module.exports.getAllOrders =  function (request, response) {

    mongodb.MongoClient.connect(mongoDBURI, function (err, client) {
        if (err) throw err;


        //get handle to the databse
        var theDatabase = client.db('heroku_hnqdq9m4');


        //get collection of routes
        var Routes = theDatabase.collection('ORDERS');


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