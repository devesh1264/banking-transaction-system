const mongoose = require("mongoose")

const accountSchema = new moongoose.Schema({
    user:{
        type: moongoose.Schema.Types.ObjectId,
        ref:"user",
        required:[true,"Account must be associated with a user"],
        index: true
    },
    status:{
        type:String,
        enum:{
            values:["ACTIVE","FROZEN","CLOSED"],
            message:"Status can be either ACTIVE, FROZEN or CLOSED ",
           
        },
         default:"ACTIVE"
    },
    currency:{
        type:String,
        required:[true,"Currency is required for creating an account"],
        default:"INR"
    }
    
},{
    timestamps:true
})
// Compound Index-->Like When on more than 2 fields Index is created...(like here user id and status)
accountSchema.index({user:1,status:1})

const accountModel = moongose.model("account", accountSchema)

model.exports = accountModel