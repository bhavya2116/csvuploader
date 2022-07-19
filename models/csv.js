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
    // FirstName:{
    //     type:String
    // },
    // LastName:{
    //     type:String
    // },
    // SSN:{
    //     type:String
    // },
    // Test1:{
    //     type:Number
    // },
    // Test2:{
    //     type:Number
    // },
    // Test3:{
    //     type:Number
    // },
    // Test4:{
    //     type:Number
    // },
    // Final:{
    //     type:Number
    // },
    // Grade:{
    //     type:String
    // }
});

module.exports = mongoose.model('product',csvSchema);