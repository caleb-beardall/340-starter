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

// Route to build the login view
router.get("/login", utilities.handleErrors(accController.buildLogin));

// Route to build the registration view
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

// Route to build the edit account view
router.get("/edit/:account_id",
    utilities.checkLogin,
    utilities.handleErrors(accController.buildEditAccount)
)

// Handle POST request to update account
router.post("/account-update",
    accValidate.updateAccountRules(),
    accValidate.checkAccUpdateRules,
    utilities.handleErrors(accController.updateAccount)
)

// Handle POST request to change password
router.post("/change-password",
    accValidate.changePasswordRules(),
    accValidate.checkChangePassRules,
    utilities.handleErrors(accController.changePassword)
)

// Handle logout request
router.get("/logout", utilities.handleErrors(accController.logoutUser))

module.exports = router;