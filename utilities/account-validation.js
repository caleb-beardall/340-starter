const utilities = require(".")
const accountModel = require("../models/account-model")
const { body, validationResult } = require("express-validator")
const validate = {}

/* ****************************************
*  Login Data Validation Rules
*  I CREATED THIS
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
*  I CREATED THIS
* *************************************** */
validate.checkLogData = async (req, res, next) => {
    const { account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/login", {
            errors,
            title: "Login",
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
        let nav = await utilities.getNav()
        res.render("account/register", {
            errors,
            title: "Registration",
            nav,
            account_firstname,
            account_lastname,
            account_email
        })
        return
    }
    next()
}

module.exports = validate