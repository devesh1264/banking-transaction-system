const mongoose= require("mongoose");

const tokenBlacklistSchema= new mongoose.Schema({
    token:{
        type:String,
        required:[true,"Token is required to blacklist "],
        unique:[true,"Token is already Blacklisted"]
    },
    blacklistedAt:{
        type:Date,
        default:Date.now,
        immutable:true,
    }
},{
    timestamps:true
})

tokenBlacklistSchema.index({ createdAt:1},{
    expireAfterSeconds:60*60*24*3 // expires in 3 days
})

const tokenBlacklistModel = mongoose.model("tokenBlaclist", tokenBlacklistSchema);

module.exports = tokenBlacklistModel;