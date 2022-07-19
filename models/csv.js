var mongoose  =  require('mongoose');

var csvSchema = new mongoose.Schema({

    sku_code:{
        type:Number,
        unique:true
    },
    product_name:{
        type:String
    },
    product_description:{
        type:String
    }
});

module.exports = mongoose.model('product',csvSchema);
