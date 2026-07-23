const transactionModel = require("../models/transaction.model")
const ledgerModel = require("../models/ledger.model")
const accountModel = require("../models/account.model")
const emailService = require("../services/email.service")
const mongoose = require("mongoose")

async function createTransaction(req,res){
    const {fromAccount,toAccount,amount,idempotencyKey} = req.body

    if(!fromAccount || !toAccount || !amount || !idempotencyKey){
        return res.status(400).json({
            message:"FromAccount,ToAccount,Amount and idempotency Key are required" 
        })
    }
    
    const fromUserAccount = await  accountModel.findOne({
        _id: fromAccount,
    })

    const toUserAccount = await  accountModel.findOne({
        _id:toAccount,
    })

    if(!fromUserAccount || !toUserAccount){
        return res.status(404).json({
            message:"Invalid fromAccount or toAccount"
        })
    }
/**
 *  Validate idempotency key
 */
const isTransactionAlredyExists = await transactionModel.findOne({
    idempotencyKey:idempotencyKey
})

if(isTransactionAlredyExists){
    if(isTransactionAlredyExists.status === "COMPLETED"){
        return res.status(200).json({
            message:"Transaction already processed",
            transaction:isTransactionAlredyExists
        })
    }

    if(isTransactionAlredyExists.status === "PENDING"){
        return res.status(202).json({
            message:"Transaction is still processing"
        })
    }
    if(isTransactionAlredyExists.status === "FAILED"){
        return res.status(500).json({
            message:"Transaction processing failed,please retry"
        })
    }
    if(isTransactionAlredyExists.status === "REVERSED"){
        return res.status(500).json({
            message:"Transaction was reversed, please retry"
        })
    }
}
/**
 * Check Account status(ACTIVE,FROZEN or CLOSED)
 */
if(fromUserAccount.status != "ACTIVE" || toUserAccount.status != "ACTIVE"){
    return res.status(400).json({
        message: "Both from and to account must be ACTIVE to process transaction"
    })
}

/**
 * Derive sender balance from ledger
 */

const balance = await fromUserAccount.getBalance()
if(balance<amount){
    return res.status(400).json({
        message:`Insufficent balance. Current balance is ${balance} and Requested amount is ${amount} `
    })
}

let transaction;
try{
/**
 * Create transaction (Pending)
 */
const session = await mongoose.startSession()
session.startTransaction()

transaction = (await transactionModel.create([{
    fromAccount,
    toAccount,
    amount,
    idempotencyKey,
    status:"PENDING"
}],{session}))[0]

const debitLedgerEntry = await ledgerModel.create([{
    account:fromAccount,
    amount:amount,
    transaction:transaction._id,
    type:"DEBIT"
}],{session})

await (() =>{
    return new Promise((resolve)=> setTimeout(resolve,10*1000));
})()

const creditLedgerEntry = await ledgerModel.create([{
    account:toAccountAccount,
    amount:amount,
    transaction:transaction._id,
    type:"CREDIT"
}],{session})

//changes done later
await transactionModel.findOneAndUpdate(
    {_id: transaction._id},
    {status:"COMPLETED"},
    {session}
)

await session.commitTransaction()
session.endSession()
}catch(error){
    return res.status(400).json({
        message: "Transaction is Pending due to some issue,please retry after sometime.."
    })
}


/**
 * Send Email notification
 */
await emailService.sendTransactionEmail(req.user.email,req.user.name,amount,toAccount)

return res.status(201).json({
    message:"Transaction Completed successfully",
    transaction:transaction
})

}

async function createInitialFundsTransaction(req,res){
    const{toAccount,amount,idempotencyKey} = req.body
if(!toAccount || !amount || !idempotencyKey){
    return res.status(400).json({
        message:"toAccount,amount and idempotency key is required"
    })
}

const toUserAccount = await accountModel.findOne({
    _id: toAccount,
})
if(!toUserAccount){
    return res.status(400).json({
        message:"Invalid Account"
    })
}

const fromUserAccount = await accountModel.findOne({
    systemUser:true,
    user: req.user._id
})

if(!fromUserAccount){
    return res.status(400).json({
        message: "System user account not found"
    })
}

const session = await mongoose.startSession()
session.startTransaction()

const transaction = new transactionModel({
    fromAccount:fromUserAccount._id,
    toAccount,
    amount,
    idempotencyKey,
    status:"PENDING"
})

const debitLedgerEntry= await ledgerModel.create([{
    account:fromUserAccount._id,
    amount:amount,
    transcation:transaction._id,
    type:"DEBIT"
}],{session})

const creditLedgerEntry= await ledgerModel.create([{
    account:fromUserAccount._id,
    amount:amount,
    transcation:transaction._id,
    type:"CREDIT"
}],{session})

transaction.status = "COMPLETED"
await transaction.save({session})
await session.commitTransaction()
session.endSession()

return res.status(201).json({
    message:"Initial funds transaction ompleted successfully",
    transaction:transaction
})

}

module.exports = {
    createTransaction,
    createInitialFundsTransaction
}
