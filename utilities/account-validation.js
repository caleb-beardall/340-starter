const utilities = require(".")
const accountModel = require("../models/account-model")
const { body, validationResult } = require("express-validator")
const validate = {}

/* ****************************************
*  Login Data Validation Rules
* *************************************** */
validate.loginRules = () => {
    return [
        // email rules ***NEEDS TO BE UPDATED***
        body("account_email")
            .trim()
            .notEmpty().withMessage("Email is required.")
            .isEmail().withMessage("A valid email is required.")
            .normalizeEmail() // refer to validator.js docs (https://github.com/validatorjs/validator.js)
            .withMessage("A valid email is required."),
        
        // password rules ***NEEDS TO BE UPDATED***
        body("account_password")
            .trim()
            .notEmpty().withMessage("Password is required.")
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password does not meet requirements."),
    ]
}

/* ****************************************
*  Registration Data Validation Rules
* *************************************** */
validate.registrationRules = () => {
    return [
        // firstname rules
        body("account_firstname")
            .trim()
            .notEmpty({ min: 1 })
            .withMessage("Please provide a first name."), // on error this message is sent
        
        // lastname rules
        body("account_lastname")
            .trim()
            .notEmpty({ min: 1 })
            .withMessage("Please provide a last name."), // on error this message is sent
        
        // email rules
        body("account_email")
            .trim()
            .notEmpty().withMessage("Email is required.")
            .isEmail().withMessage("A valid email is required.")
            .normalizeEmail() // refer to validator.js docs (https://github.com/validatorjs/validator.js)
            .custom(async (account_email) => {
                const emailExists = await accountModel.checkExistingEmail(account_email)
                if (emailExists) {
                    throw new Error("Email exists. Please log in or use different email")
                }
            }),
        
        // password rules
        body("account_password")
            .trim()
            .notEmpty().withMessage("Password is required.")
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password does not meet requirements."),
    ]
}

/* ****************************************
*  Check data and return errors or continue to login
* *************************************** */
validate.checkLogData = async (req, res, next) => {
    const { account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        const accountNav = await utilities.getAccountNav(req, res)
        let nav = await utilities.getNav()
        res.render("account/login", {
            errors,
            title: "Login",
            accountNav,
            nav,
            account_email
        })
        return
    }
    next()
}

/* ****************************************
*  Check data and return errors or continue to registration
* *************************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        const accountNav = await utilities.getAccountNav(req, res)
        let nav = await utilities.getNav()
        res.render("account/register", {
            errors,
            title: "Registration",
            accountNav,
            nav,
            account_firstname,
            account_lastname,
            account_email
        })
        return
    }
    next()
}

/* ****************************************
*  Update Account Validation Rules
* *************************************** */
validate.updateAccountRules = () => {
    return [
        // firstname rules
        body("account_firstname")
            .trim()
            .notEmpty({ min: 1 })
            .withMessage("Please provide a first name.")
            .matches(/^[A-Za-z ]+$/)
            .withMessage("First name only allows for letters and spaces."),
        
        // lastname rules
        body("account_lastname")
            .trim()
            .notEmpty({ min: 1 })
            .withMessage("Please provide a last name.")
            .matches(/^[A-Za-z ]+$/)
            .withMessage("Last name only allows for letters and spaces."),
        
        // email rules
        body("account_email")
            .trim()
            .notEmpty().withMessage("Email is required.")
            .isEmail().withMessage("A valid email is required.")
            .normalizeEmail()
            .custom(async (account_email, { req }) => {
                const account_id = req.body.account_id
                const existingAccount = await accountModel.getAccountByEmail(account_email)
                if (existingAccount && existingAccount.account_id != account_id) {
                    throw new Error("Email already in use. Please use a different email.")
                }
                return true
            }),
    ]
}

/* ****************************************
*  Change Password Validation Rules
* *************************************** */
validate.changePasswordRules = () => {
    return [
        // password rules
        body("account_password")
            .trim()
            .notEmpty().withMessage("Password is required.")
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password does not meet requirements."),
    ]
}

/* ****************************************
*  Check data and return errors or continue to update account
* *************************************** */
validate.checkAccUpdateRules = async (req, res, next) => {
    const { account_id, account_firstname, account_lastname, account_email } = req.body
    const accountData = await accountModel.getAccountDataById(account_id)
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        const accountNav = await utilities.getAccountNav(req, res)
        let nav = await utilities.getNav()
        res.render("account/edit-account", {
            errors,
            title: "Edit " + accountData.account_firstname + " " + accountData.account_lastname + "'s Account",
            accountNav,
            nav,
            account_id,
            account_firstname,
            account_lastname,
            account_email
        })
        return
    }
    next()
}

/* ****************************************
*  Check data and return errors or continue to change password
* *************************************** */
validate.checkChangePassRules = async (req, res, next) => {
    const { account_id } = req.body
    const accountData = await accountModel.getAccountDataById(account_id)
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        const accountNav = await utilities.getAccountNav(req, res)
        let nav = await utilities.getNav()
        const clientName = `${accountData.account_firstname} ${accountData.account_lastname}`
        res.render("account/edit-account", {
            errors,
            title: "Edit " + clientName + "'s Account",
            accountNav,
            nav,
            account_id: accountData.account_id,
            account_firstname: accountData.account_firstname,
            account_lastname: accountData.account_lastname,
            account_email: accountData.account_email
        })
        return
    }
    next()
}

module.exports = validate