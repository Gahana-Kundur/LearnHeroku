const cool = require('cool-ascii-faces')
const express = require('express')
const path = require('path')
var MongoClient = require('mongodb').MongoClient;
const PORT = process.env.PORT || 5000

express()
    .use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get('/', (req, res) => res.render('pages/index'))
    .get('/cool', (req, res) => res.send(cool()))
    .get('/mongodb', function (request, response) {

      //MongoClient.connect(encodeURI(process.env.MONGODB_URI)
      MongoClient.connect(process.env.MONGODB_URI, function(err, client) {
        if(err) throw err;
        //get collection of routes
        var db = client.db('heroku_xrj74bxb');
        var Routes = db.collection('Routes');
        //get all Routes with frequency >=1
        Routes.find({ frequency : { $gte: 0 } }).sort({ name: 1 }).toArray(function (err, docs) {
          if(err) throw err;

          response.render('pages/db', {results: docs});

        });

        //close connection when your app is terminating.
        client.close();
      });//end of connect
    })//end app.get
    .listen(PORT, () => console.log(`Listening on ${ PORT }`))
