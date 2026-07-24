const {Router} = require('express');
const authMiddleware = require("../middlewares/auth.middleware")
const transactionController =require("../controllers/transaction.controller")

/**
 * - POST/api/transactions/
 * - Create a new transaction
 */

const transcationRoutes = Router();

/**
 * @swagger
 * /api/transactions:
 *   post:
 *     summary: Create a new transaction
 *     tags:
 *       - Transactions
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fromAccount
 *               - toAccount
 *               - amount
 *             properties:
 *               fromAccount:
 *                 type: string
 *                 example: <From_ACCOUNT_ID>
 *               toAccount:
 *                 type: string
 *                 example: <To_ACCOUNT_ID>
 *               amount:
 *                 type: number
 *                 example: 1000
 *               idempotencyKey:
 *                 type: string
 *                 example: init-funds-xyz
 *                
 *     responses:
 *       201:
 *         description: Transaction successful
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 */
transcationRoutes.post("/",authMiddleware.authMiddleware,transactionController.createTransaction);


/**
 * @swagger
 * /api/transactions/system/initial-funds:
 *   post:
 *     summary: Create initial funds transaction
 *     tags:
 *       - Transactions
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - toAccount
 *               - amount
 *               - idempotencyKey
 *             properties:
 *               toAccount:
 *                 type: string
 *                 example: <ACCOUNT_ID>
 *               amount:
 *                 type: number
 *                 example: 5000
 *               idempotencyKey:
 *                 type: string
 *                 example: init-funds-xyz
 *     responses:
 *       201:
 *         description: Initial funds added successfully
 *       401:
 *         description: Unauthorized
 */
transcationRoutes.post("/system/initial-funds",authMiddleware.authSystemUserMiddleware,transactionController.createInitialFundsTransaction)

module.exports = transcationRoutes;

