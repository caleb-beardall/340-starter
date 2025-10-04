// Needed Resources
const express = require("express")
const router = new express.Router()
const accController = require("../controllers/accountController")
const utilities = require("../utilities")
const accValidate = require("../utilities/account-validation")

// Route to build the account management view
router.get(
    "/",
    utilities.checkLogin,
    utilities.handleErrors(accController.buildAccManagement))

// Route to build login view
router.get("/login", utilities.handleErrors(accController.buildLogin));

// Route to build registration view
router.get("/register", utilities.handleErrors(accController.buildRegister))

// Handle POST requests to register a new user account
router.post(
    "/register",
    accValidate.registrationRules(),
    accValidate.checkRegData,
    utilities.handleErrors(accController.registerAccount)
)

// Handle POST requests to login
router.post(
    "/login",
    accValidate.loginRules(),
    accValidate.checkLogData,
    utilities.handleErrors(accController.accountLogin)
)

module.exports = router;