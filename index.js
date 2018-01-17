'use strict'
const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const searchTerm = require('./models/searchTerm');
const GoogleImages = require('google-images');
var client = new GoogleImages(
    process.env.CSE,
     process.env.KEY_GOOGLE

  );

var port = Number(process.env.PORT || 8080);

const app = express();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/searchTerms',{useMongoClient:true});

app.use('/', express.static(__dirname + '/public'));


app.get('/api/recentSearch', function (req, res) {
    searchTerm.find({}, { '_id': 0, '__v': 0 }, function (err, documents) {
        if (err) {
            res.send('An error has occurred');
        }
        res.json(documents);
    });
});

app.get('/api/imageSearch/:searchValue*', function (req, res) {

    var searchValue = req.params.searchValue;
var offset;
    if(req.query.offset>0){
     offset=req.query.offset;
}
else{
     offset=1;
}

    var data = new searchTerm({
        term: searchValue,
        when: new Date().toISOString()
    });

    data.save(function (err) {
        if (err) {
            res.send('An error has occurred');
        }
        console.log('The data is saved');
    });
    client.search(searchValue,{page:offset}).then(function(images){
        var imagenesArray=[];
images.forEach(function(image,index){
   var imagenFinal={
    url:image.url,
    snippet:image.description,	
    thumbnail:image.thumbnail.url,
    context:image.parentPage
   }
imagenesArray[index]=imagenFinal;
});

        res.json(imagenesArray);

    });
});
app.listen(port, function () {
    console.log('OK');
});