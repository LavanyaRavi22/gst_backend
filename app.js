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
	console.log('you posted to /item');
	console.log(req.body);
	console.log(mongodb);
	dbo.collection('items').insert({name: req.body.name,
					price: req.body.price,
					gst: req.body.gst,
					final_price: req.body.final_price,
					timestamp: new Date()
				   },(err,result)=>{
			if(err)
				console.log(err);
			else {
				console.log("Done");
				res.send('Done');
			}
		});
})

// app.post("/newItem",(req,res) => {
// 	console.log('you posted to /newItem');
// 	// console.log(req.body);
// 	// console.log(mongodb);
// 	var item = new Item();
// 	item.name = req.body.name;
//  	item.text = req.body.price;
//  	item.gst = req.body.gst;
//  	item.final_price = req.body.final_price;

// 	item.save(function(err) {
// 	 if (err)
// 	 res.send(err);
// 	 res.json({' message': 'Item successfully added!' });
// 	 });
	
// })

app.get("/allItems",(req,res) => {
	console.log('/allItems');

    var collection = dbo.collection('items');
      collection.find().toArray(function(err, docs) {
        res.json(docs);
      });

});