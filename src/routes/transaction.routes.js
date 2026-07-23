const {Router} = require('express');
const authMiddleware = require("../middlewares/auth.middleware")
const transactionController =require("../controllers/transaction.controller")

/**
 * - POST/api/transactions/
 * - Create a new transaction
 */

const transcationRoutes = Router();

transcationRoutes.post("/",authMiddleware.authMiddleware,transactionController.createTransaction);

/**
 * - POST/api/transactions/system/initial-funds
 * - Create initial funds transaction from system user
 */

transcationRoutes.post("/system/initial-funds",authMiddleware.authSystemUserMiddleware,transactionController.createInitialFundsTransaction)

module.exports = transcationRoutes;

