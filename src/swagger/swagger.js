const swaggerJSDoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",

        info: {
            title: "Backend Ledger API - Secure Banking Transaction System",
            version: "1.0.0",
            description:
                "REST API for a Banking Transaction System built using Node.js, Express and MongoDB.",
                description: `
A secure Banking Transaction System built using **Node.js**, **Express.js**, **MongoDB**, **Mongoose**, and **JWT Authentication**.

This project demonstrates real-world backend concepts including user authentication, account management, double-entry ledger accounting, MongoDB ACID transactions, idempotent fund transfers, email notifications, and interactive API documentation.

---

# 🚀 Quick Start

## Demo Users

### User 1 (System User)

**Email:** user.one.test01@gmail.com

**Password:** Password@123

---

### User 2 (System User)

**Email:** user.two.test01@gmail.com

**Password:** Password@123

---

# 🔐 Before Testing

1. Login using one of the demo users.
2. Copy the JWT token from the Login response.
3. Click the **Authorize** button (top-right).
4. Paste **ONLY** the JWT token.
5. **Do NOT** include the word **Bearer**.

---

# 📋 Recommended API Flow

1. Login
2. Authorize
3. Get Accounts
4. Create Account *(Only if your user doesn't already have one.)*
5. Add Initial Funds
6. Check Account Balance
7. Transfer Funds
8. Check Updated Balance
9. Logout

---

# 📌 Important Notes

• Every new transaction requires a **unique idempotencyKey**.

• Reusing the same **idempotencyKey** will **NOT** create another transaction. Instead, the previously processed transaction details will be returned.

• Only users with **systemUser = true** can access the **Initial Funds** endpoint.

• For security reasons, the **systemUser** flag **cannot** be enabled through any API. It can only be assigned directly in the database by an administrator.

• Obtain your **Account ID** using **GET /api/accounts** before performing any transaction.

• After creating an account, use **GET /api/accounts** to retrieve the generated Account ID before testing transaction-related APIs.

• All protected endpoints require a valid JWT token.

---

# 💡 Testing Tip

Follow the API flow from top to bottom for the smoothest testing experience.

Using the same order ensures all required resources (JWT, Account ID, Initial Balance, etc.) are available before performing transactions.

`
        },

        servers: [
            {
                url: "http://localhost:3000",
                description: "Local Development Server",
            },
            {
                url: "https://backend-ledger-3zv8.onrender.com",
                description: "Production Server",
            },
        ],

        components: {
    securitySchemes: {
        bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
        },
    },

    schemas: {
        User: {
            type: "object",
            required: ["name", "email", "password"],
            properties: {
                name: {
                    type: "string",
                    example: "User One",
                },
                email: {
                    type: "string",
                    example: "user.one.test01@gmail.com",
                },
                password: {
                    type: "string",
                    example: "Password@123",
                },
            },
        },
        Account: {
    type: "object",
    required: ["accountType"],
    properties: {
        accountType: {
            type: "string",
            enum: ["Savings", "Current"],
            example: "Savings",
        },
    },
},
    },
},
    },

    apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;