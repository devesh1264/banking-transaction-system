const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const accountController = require("../controllers/account.controller")

const router = express.Router()

/**
 * @swagger
 * /api/accounts:
 *   post:
 *     summary: Create a new bank account
 *     tags:
 *       - Accounts
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Account'
 *     responses:
 *       201:
 *         description: Account created successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 */
router.post("/",authMiddleware.authMiddleware, accountController.createAccountController)

/**
 * @swagger
 * /api/accounts:
 *   get:
 *     summary: Get all accounts of the logged-in user
 *     tags:
 *       - Accounts
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Accounts fetched successfully
 *       401:
 *         description: Unauthorized
 */

router.get("/", authMiddleware.authMiddleware,accountController.getUserAccountsController)

/**
 * @swagger
 * /api/accounts/balance/{accountId}:
 *   get:
 *     summary: Get account balance
 *     tags:
 *       - Accounts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: accountId
 *         required: true
 *         schema:
 *           type: string
 *         example: <ACCOUNT_ID>
 *     responses:
 *       200:
 *         description: Balance fetched successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Account not found
 */
router.get("/balance/:accountId",authMiddleware.authMiddleware,accountController.getAccountBalanceController)


module.exports= router
