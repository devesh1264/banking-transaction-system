const express = require("express")
const path = require("path")
const app = express()

const cookieParser = require("cookie-parser")

// Routes required
const authRouter = require("./routes/auth.routes")
const accountRouter = require("./routes/accounts.routes")
const transcationRoutes = require("./routes/transaction.routes")

// Middleware
app.use(express.json())
app.use(cookieParser())
//
app.use(express.static(path.join(__dirname, "../public")))
// api
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"))
})

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Backend Ledger API is healthy",
        timestamp: new Date(),
    });
});

// Use Routes
app.use("/api/auth",authRouter)
app.use("/api/accounts",accountRouter)
app.use("/api/transactions",transcationRoutes)

module.exports = app
