# Banking Transaction System

A secure backend for a banking and ledger-based transaction system built
with **Node.js, Express.js, MongoDB, and Mongoose**.

The project focuses on transaction integrity, authentication,
authorization, idempotency, and API design rather than simply
implementing CRUD operations.

## Live Deployment

  ----------------------------------------------------------------------------------------------
  Resource                            Link
  ----------------------------------- ----------------------------------------------------------
  **Live API**                        https://backend-ledger-3zv8.onrender.com

  **Swagger / OpenAPI Docs**          https://backend-ledger-3zv8.onrender.com/api-docs

  **GitHub Repository**               https://github.com/devesh1264/banking-transaction-system
  ----------------------------------------------------------------------------------------------

The deployed service exposes the backend API and an interactive Swagger
UI for API testing.

------------------------------------------------------------------------

## Key Features

### Authentication & Authorization

-   User registration and login
-   JWT-based authentication
-   HTTP cookie-based authentication
-   Protected API endpoints
-   Logout support
-   Privileged system-user authorization for system-only operations

### Banking Accounts

-   Create and manage bank accounts
-   Retrieve accounts belonging to the authenticated user
-   Retrieve account balances
-   Account-level transaction operations

### Money Transfers

-   Transfer funds between accounts
-   Transaction history
-   Validation around transaction requests
-   Atomic database operations using MongoDB transactions

### Double-Entry Ledger

The transaction system follows a **double-entry ledger model**.

A transfer is represented through corresponding debit and credit entries
rather than treating the balance update as an isolated field
modification.

Conceptually:

``` text
Source Account
      |
      | Debit
      v
   Transaction
      ^
      | Credit
      |
Destination Account
```

This provides a ledger-oriented model for tracking movement of funds.

### ACID Transactions

Fund transfers use MongoDB transaction support so related database
operations are committed atomically.

The intended behavior is:

``` text
Begin Transaction
      |
      +--> Validate source account
      |
      +--> Validate destination account
      |
      +--> Create ledger entries
      |
      +--> Update required account state
      |
      v
   COMMIT
```

If a required operation fails, the transaction is rolled back instead of
leaving the system in a partially updated state.

### Idempotent Fund Transfers

Transfer requests use an `idempotencyKey`.

If the same request is accidentally submitted again because of a network
retry, double-click, client retry, or similar condition, the previously
processed transaction can be returned instead of creating another
transfer.

``` text
Request
   |
   | idempotencyKey
   v
Already processed?
   |          |
  Yes         No
   |          |
Return       Process
existing     transaction
result           |
                 v
             Store key
```

This prevents duplicate processing of the same transfer request.

### System-Only Initial Funds

Initial-funds functionality is restricted to privileged system users.

The `systemUser` privilege is not intended to be enabled through the
normal public API flow and is controlled separately at the
database/administrative level.

### API Documentation

The project includes interactive **Swagger/OpenAPI documentation**.

You can inspect request schemas, authentication requirements, endpoints,
response codes, and test API operations directly from:

**https://backend-ledger-3zv8.onrender.com/api-docs**

------------------------------------------------------------------------

## Tech Stack

  Technology              Purpose
  ----------------------- ----------------------------------
  **Node.js**             Backend runtime
  **Express.js**          REST API framework
  **MongoDB**             Database
  **Mongoose**            MongoDB ODM
  **JWT**                 Authentication
  **HTTP Cookies**        Authentication/session transport
  **Swagger / OpenAPI**   API documentation and testing
  **Render**              Production deployment

------------------------------------------------------------------------

## API Overview

### Authentication

  Method   Endpoint               Description
  -------- ---------------------- -------------------------
  `POST`   `/api/auth/register`   Register a new user
  `POST`   `/api/auth/login`      Login an existing user
  `POST`   `/api/auth/logout`     Logout the current user

### Accounts

  Method   Endpoint                              Description
  -------- ------------------------------------- ------------------------------------
  `POST`   `/api/accounts`                       Create a bank account
  `GET`    `/api/accounts`                       Get accounts of the logged-in user
  `GET`    `/api/accounts/balance/{accountId}`   Get account balance

### Transactions

  ------------------------------------------------------------------------------------------
  Method                  Endpoint                                   Description
  ----------------------- ------------------------------------------ -----------------------
  `POST`                  `/api/transactions`                        Create a transaction /
                                                                     transfer

  `GET`                   `/api/transactions`                        Retrieve transaction
                                                                     history

  `POST`                  `/api/transactions/system/initial-funds`   Create initial-funds
                                                                     transaction for
                                                                     authorized system users
  ------------------------------------------------------------------------------------------

The exact request and response schemas are available in the Swagger
documentation.

------------------------------------------------------------------------

## Typical API Flow

A normal user flow is:

``` text
1. Register
      ↓
2. Login
      ↓
3. Receive authenticated session/JWT
      ↓
4. Create a bank account
      ↓
5. Retrieve Account ID
      ↓
6. Check account balance
      ↓
7. Transfer funds
      ↓
8. Retrieve transaction history
      ↓
9. Check updated balance
      ↓
10. Logout
```

For transaction-related requests, the required authentication and
account information must be available before the transfer is performed.

------------------------------------------------------------------------

## Transaction Integrity

The project is designed around several important properties of financial
transaction systems:

### Atomicity

A transfer should not leave the database half-updated.

``` text
Debit + Credit + Related Updates
              |
              v
        Single DB Transaction
              |
       +------+------+
       |             |
    Success        Failure
       |             |
     Commit        Rollback
```

### Idempotency

Repeated submission of the same transfer request can be detected through
its `idempotencyKey`.

### Ledger Consistency

Money movement is represented through corresponding ledger entries
rather than relying only on a mutable balance field.

### Authorization

Sensitive operations are protected by authentication and role/privilege
checks.

------------------------------------------------------------------------

## Security

The backend implements:

-   JWT authentication
-   Cookie-based authentication
-   Protected routes
-   Authorization checks
-   System-only endpoint restrictions
-   Input validation
-   Idempotency protection for transfer requests
-   Transactional database operations
-   Environment-based configuration

Sensitive configuration such as database credentials, JWT secrets, and
other private values should be stored in environment variables rather
than committed to the repository.

------------------------------------------------------------------------

## Project Structure

The repository is organized around the backend application and its
source code:

``` text
banking-transaction-system/
│
├── public/
├── src/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── ...
│
├── .gitignore
├── package.json
├── package-lock.json
├── server.js
└── README.md
```

The exact source structure may evolve as the project is extended.

------------------------------------------------------------------------

## Running Locally

### 1. Clone the repository

``` bash
git clone https://github.com/devesh1264/banking-transaction-system.git
cd banking-transaction-system
```

### 2. Install dependencies

``` bash
npm install
```

### 3. Configure environment variables

Create a `.env` file containing the configuration required by the
application.

Example:

``` env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Use the environment variable names expected by the current source code.

### 4. Start the server

For development:

``` bash
npm run dev
```

Or start the server directly:

``` bash
node server.js
```

The local API will typically be available at:

``` text
http://localhost:3000
```

Swagger documentation:

``` text
http://localhost:3000/api-docs
```

------------------------------------------------------------------------

## Testing the API

The easiest way to test the deployed API is through Swagger:

**https://backend-ledger-3zv8.onrender.com/api-docs**

A typical testing sequence is:

``` text
Register
   ↓
Login
   ↓
Authorize
   ↓
Create / retrieve account
   ↓
Check balance
   ↓
Perform transfer
   ↓
Verify transaction history
   ↓
Verify updated balance
```

For protected endpoints, authenticate first and provide the required
JWT/session information.

------------------------------------------------------------------------

## Example Transfer Concept

A transfer such as:

``` text
Account A → Account B
₹1,000
```

is treated as a financial transaction rather than simply:

``` text
A.balance -= 1000
B.balance += 1000
```

The system uses transaction and ledger logic so that the related
operations can be handled consistently.

A simplified conceptual representation is:

``` text
Transaction
├── Debit Entry
│   └── Account A: -₹1,000
│
└── Credit Entry
    └── Account B: +₹1,000
```

The actual implementation details are defined by the backend source code
and database models.

------------------------------------------------------------------------

## Deployment

The backend is deployed on **Render**.

### Production API

``` text
https://backend-ledger-3zv8.onrender.com
```

### Production Swagger

``` text
https://backend-ledger-3zv8.onrender.com/api-docs
```

The production deployment provides a directly testable version of the
backend without requiring local setup.

------------------------------------------------------------------------

## Engineering Concepts Demonstrated

This project demonstrates practical backend and systems concepts
including:

-   REST API design
-   Authentication and authorization
-   JWT-based security
-   Cookie-based authentication
-   MongoDB data modeling
-   Mongoose
-   Database transactions
-   ACID properties
-   Double-entry ledger accounting
-   Idempotency
-   Transaction history
-   Role/privilege-based access control
-   API documentation with OpenAPI
-   Production deployment
-   Environment-based configuration

------------------------------------------------------------------------

## Project Status

The backend is deployed and provides a working API with authentication,
account management, transaction processing, ledger-oriented accounting,
idempotency handling, API documentation, and production deployment.

The system can be extended further with additional banking workflows,
monitoring, rate limiting, audit logging, and more comprehensive
automated testing.

------------------------------------------------------------------------

## Repository

**GitHub:**\
https://github.com/devesh1264/banking-transaction-system

**Live API:**\
https://backend-ledger-3zv8.onrender.com

**Swagger / OpenAPI:**\
https://backend-ledger-3zv8.onrender.com/api-docs
