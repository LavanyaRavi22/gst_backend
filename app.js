var express = require('express');
var mongoClient = require('mongodb').MongoClient; 
var mongodb; 
var dbo;
var app = express();

var path = require('path');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));



let port = 8000; 
app.listen(process.env.PORT || port,() => { 	
	if (mongoClient != null && mongoClient != undefined){ 		
		mongoClient.connect('mongodb://test:12345@ds129540.mlab.com:29540/gst_demonstrator',
							{ useNewUrlParser: true },
							(err,dbInstance) => { 			
								if (err){ 				
									mongodb = null; 				
									console.log('connection failed'); 
									console.log(err);			
								}else{ 				
									mongodb = dbInstance; 
									dbo = dbInstance.db("gst_demonstrator");
									//console.log(mongodb);				
									console.log('connection done'); 			
								} 		
							}); 	
	} 	

console.log(`Listening on port ${port}`); });

app.use('/js',express.static(path.join(__dirname, 'js')));

app.all("/*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
  return next();
});


app.post("/item",(req,res) => {

	dbo.collection('items').insert({name: req.body.name,
					price: req.body.price,
					gst: req.body.gst,
					final_price: req.body.final_price,
					timestamp: new Date()
				   },(err,result)=>{
			if(err)
				console.log(err);
			else {

				res.send('Done');
			}
		});
})

app.get("/allItems",(req,res) => {

    var collection = dbo.collection('items');
      collection.find().toArray(function(err, docs) {
        res.json(docs);
      });

});