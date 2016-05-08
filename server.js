var express=require("express");
var router=express.Router();
var bodyParser=require("body-parser");

var mongoClient=require("mongodb").MongoClient;
var url="mongodb://localhost:27017/test";
var app=express();
var port=3000;

var webpack=require("webpack");
var webpackDevMiddleware=require('webpack-dev-middleware');
var webpackHotMiddleware=require('webpack-hot-middleware');
var webpackConfig=require('./webpack.config');

var webpackCompiler=webpack(webpackConfig);
app.use(webpackDevMiddleware(webpackCompiler,
    {   noInfo:true,
        publicPath:webpackConfig.output.publicPath
    }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

router.post('/',function(req,res){
    var Name=req.body.name;
    var Borough=req.body.borough;
    var Cuisine=req.body.cuisine;
    
    mongoClient.connect(url,function(err,db){
        if(err){
            console.log(err);
        }
        var coll=db.collection('restaurants');
        var queryParam={};
        if(Name)
            queryParam.name=new RegExp(Name,'i');
        if(Borough)
            queryParam.borough=new RegExp(Borough,'i');
        if(Cuisine)
            queryParam.cuisine=new RegExp(Cuisine,'i');
            
        var cur=coll.find(queryParam,{name:1,borough:1,cuisine:1,restaurant_id:1,address:1,_id:0});
        cur.limit(10);
        var ar=cur.toArray(function(err,document){
            res.send(document);
            db.close();
        });
            
    });
});

router.get('/',function(req,res){
   res.sendFile(__dirname+'/index.html'); 
});

app.use('/',router);

app.listen(port,function(error){
    if(error){
        console.log(error);
    }else{
        console.log('listening on port 3000')
    }
})
