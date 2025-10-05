const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  const accountNav = await utilities.getAccountNav(req, res)
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    accountNav,
    nav,
    errors: null
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  const accountNav = await utilities.getAccountNav(req, res)
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    accountNav,
    nav,
    errors: null
  })
}

/* ****************************************
*  Deliver account management view
* *************************************** */
async function buildAccManagement(req, res, next) {
  const accountNav = await utilities.getAccountNav(req, res)
  let nav = await utilities.getNav()
  const account_id = res.locals.accountData.account_id
  const accountData = await accountModel.getAccountDataById(account_id)
  res.render("./account/account-management", {
    title: "Account Management",
    accountNav,
    nav,
    clientName: accountData.account_firstname,
    clientId: account_id,
    clientType: accountData.account_type
  })
}

/* ****************************************
*  Process registration
* *************************************** */
async function registerAccount(req, res) {
  const accountNav = await utilities.getAccountNav(req, res)
  let nav = await utilities.getNav()
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password
  } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash(
      "notice-bad",
      "Sorry, there was an error processing the registration."
    )
    res.status(500).render("account/register", {
      title: "Registration",
      accountNav,
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice-good",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      accountNav,
      nav,
      errors: null
    })
  } else {
    req.flash("notice-bad", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      accountNav,
      nav
    })
  }
}

/* ****************************************
*  Process login request
* *************************************** */
async function accountLogin(req, res) {
  const accountNav = await utilities.getAccountNav(req, res)
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice-bad", "Please check your credentials and try again.")
    res.status(404).render("account/login", {
      title: "Login",
      accountNav,
      nav,
      errors: null,
      account_email
    })
    return
  }

  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if (process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpONly: true, maxAge: 3600 * 1000})
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      } // THIS IF STATEMENT IS VERY DIFFERENT IN THE LEARNING ACTIVITY NOTES
      return res.redirect("/account/")
    } else {
      req.flash("notice-bad", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        accountNav,
        nav,
        errors: null,
        account_email
      })
    }
  } catch (error) {
    return new Error('Access Forbidden') // THIS IS 'THROW NEW ERROR()' IN THE LEARNING ACTIVITY NOTES
  }
}

/* ****************************************
*  Deliver edit account view
* *************************************** */
async function buildEditAccount(req, res, next) {
  const account_id = parseInt(req.params.account_id)
  const accountNav = await utilities.getAccountNav(req, res)
  let nav = await utilities.getNav()
  const accountData = await accountModel.getAccountDataById(account_id)
  const clientName = `${accountData.account_firstname} ${accountData.account_lastname}`
  res.render("./account/edit-account", {
    title: "Edit " + clientName + "'s Account",
    accountNav,
    nav,
    errors: null,
    account_id: accountData.account_id,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email
  })
}

/* ****************************************
*  Process account update
* *************************************** */
async function updateAccount(req, res, next) {
  const accountNav = await utilities.getAccountNav(req, res)
  let nav = await utilities.getNav()
  const {
    account_id,
    account_firstname,
    account_lastname,
    account_email
  } = req.body

  const updateResults = await accountModel.updateAccountInfo(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  )

  if (updateResults) {
    const clientName = updateResults.account_firstname
    req.flash("notice-good", `${clientName}, your account was successfully updated.`)
    res.redirect("/account/")
  } else {
    const clientName = updateResults.account_firstname + " " + updateResults.account_lastname
    req.flash("notice-bad", "Sorry, the account update failed.")
    res.status(501).render("account/edit-account", {
      title: "Edit " + clientName + "'s Account",
      accountNav,
      nav,
      errors: null,
      account_id,
      account_firstname,
      account_lastname,
      account_email
    })
  }
}

/* ****************************************
*  Process password change
* *************************************** */
async function changePassword(req, res, next) {
  const accountNav = await utilities.getAccountNav(req, res)
  let nav = await utilities.getNav()
  const { account_id, account_password } = req.body
  const accountData = await accountModel.getAccountDataById(account_id)
  const clientName = `${accountData.account_firstname} ${accountData.account_lastname}`

  let hashedPassword
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash(
      "notice-bad",
      "Sorry, there was an error processing the password update."
    )
    res.status(500).render("account/edit-account", {
      title: "Edit " + clientName + "'s Account",
      accountNav,
      nav,
      errors: null,
    })
  }

  const updateResults = await accountModel.changeUserPassword(account_id, hashedPassword)

  if (updateResults) {
    const clientName = updateResults.account_firstname
    req.flash("notice-good", `${clientName}, your password was successfully updated.`)
    res.redirect("/account/")
  } else {
    const clientName = updateResults.account_firstname + " " + updateResults.account_lastname
    req.flash("notice-bad", "Sorry, the password change failed.")
    res.status(501).render("account/edit-account", {
      title: "Edit " + clientName + "'s Account",
      accountNav,
      nav,
      errors: null,
      account_id: updateResults.account_id,
      account_firstname: updateResults.account_firstname,
      account_lastname: updateResults.account_lastname,
      account_email: updateResults.account_email
    })
  }
}

/* ****************************************
*  Process logout request
* *************************************** */
async function logoutUser(req, res) {
  res.clearCookie("jwt")
  return res.redirect("/")
}

module.exports = { buildLogin, buildRegister, buildAccManagement, registerAccount, accountLogin, buildEditAccount, updateAccount, changePassword, logoutUser }