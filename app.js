var express     = require('express');
var mongoose    = require('mongoose');
var multer      = require('multer');
var path        = require('path');
var csvModel    = require('./models/csv');
var csv         = require('csvtojson');
var bodyParser  = require('body-parser');

var storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./public/uploads');
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname);
    }
});

var uploads = multer({storage:storage});

//connect to db
mongoose.connect('mongodb+srv://Bhuvaneshwari16:Assignment@cluster3.hknhiay.mongodb.net/?retryWrites=true&w=majority',{useNewUrlParser:true})
.then(()=>console.log('connected to db'))
.catch((err)=>console.log(err))

//init app
var app = express();

//set the template engine
app.set('view engine','ejs');

//fetch data from the request
app.use(bodyParser.urlencoded({extended:false}));

//static folder
app.use(express.static(path.resolve(__dirname,'public')));

//default pageload
app.get('/',(req,res)=>{
    let searchcode = req.query.search;
    var query ='';
    if(searchcode && !isNaN(searchcode)){
    query =  {$or:[{"sku_code":searchcode},{"product_name": searchcode},{"product_description":searchcode}]};
} else { 
    query =  {$or:[{"product_name":  searchcode},{"product_description":searchcode}]};
}
if(searchcode) {
    csvModel.find(query, function(err, result) {
        if (err) throw err;
        
        res.render('demo',{data:result});
        
      });
} else {
   
    csvModel.find((err,data)=>{
         if(err){
             console.log(err);
         }else{
              if(data!=''){
                  res.render('demo',{data:data});
              }else{
                  res.render('demo',{data:''});
              }
         }
    });
}
});

var temp ;

app.post('/',uploads.single('csv'),(req,res)=>{

     //Validate file csv anb file size not exceeding 100kb
    let file = req.file;
    if (!file.mimetype == "text/csv" && fileSize >100*1024) {
         res.send('Only .csv format allowed! and file size exceeded 100kb');
      }

 //convert csvfile to jsonArray   
csv()
.fromFile(req.file.path)
.then((jsonObj)=>{
    console.log(jsonObj);
    // for(var x=0;x<jsonObj;x++){
    //      temp = parseFloat(jsonObj[x].Test1)
    //      jsonObj[x].Test1 = temp;
    //      temp = parseFloat(jsonObj[x].Test2)
    //      jsonObj[x].Test2 = temp;
    //      temp = parseFloat(jsonObj[x].Test3)
    //      jsonObj[x].Test3 = temp;
    //      temp = parseFloat(jsonObj[x].Test4)
    //      jsonObj[x].Test4 = temp;
    //      temp = parseFloat(jsonObj[x].Final)
    //      jsonObj[x].Final = temp;
    //  }
     csvModel.insertMany(jsonObj,(err,data)=>{
            if(err){
                console.log(err);
            }else{
                res.redirect('/');
            }
     });
   });
});

//assign port
var port = process.env.PORT || 3000;
app.listen(port,()=>console.log('server run at port '+port));