const mongoose= require('mongoose');

const ledgerSchema = new mongoose.Schema({
    account:{
            type: mongoose.Types.ObjectId,
            ref:"account",
             required:[true,"ledger must be associated with an account"],
             index:true,
             immutable:true
            },
    amount:{
        type:Number,
        required:[true,"Amount is required for creating a ledger entry"],
        immutable:true
    },
    transcation:{
        type: mongoose.Types.ObjectId,
        ref:"transaction",
        required:[true,"ledger must be associated witha transaction"],
        index:true,
        immutable:true
    },
    type:{
        type: String,
        enum:{
            values:["CREDIT","DEBIT"],
            message:"Type can be either Credit or Debit"
        },
        required:[true,"ledger type is required"],
        immutable:true
    }
})

function preventledgerModification(){
    throw new Error("Ledger entries are immutable and cannot be modified or deleted");
}

ledgerSchema.pre('findOneAndUpdate',preventledgerModification);
ledgerSchema.pre('updateOne',preventledgerModification);
ledgerSchema.pre('deleteOne',preventledgerModification);
ledgerSchema.pre('remove',preventledgerModification);
ledgerSchema.pre('deleteMany',preventledgerModification);
ledgerSchema.pre('updatemany',preventledgerModification);
ledgerSchema.pre("findOneAndDelete",preventledgerModification);
ledgerSchema.pre("findOneandReplace",preventledgerModification);



const ledgerModel = mongoose.model('ledger',ledgerSchema);

module.exports = ledgerModel;