const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}
/* ************************
 * Constructs the account nav HTML
 ************************** */
Util.getAccountNav = async function (req, res, next) {
  let list = ""
  if (res.locals.loggedin) {
    list = `<a href="/account/" title="Click to manage account">Welcome, ${res.locals.accountData.account_firstname}!</a>`
    list += " | "
    list += `<a href="/account/logout" title="Click to log out">Logout</a>`
  } else {
    list = `<a href="/account/login" title="Click to log in">My Account</a>`
  }
  return list
}

/* ************************
 * Constructs the classifications nav HTML
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  // console.log(data)
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="classifications-grid">'
    data.forEach(vehicle => { 
      grid += '<li class="classifications-grid-item">'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + ' details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="classification-item-content">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid = '<p class="notice-bad">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the vehicle view HTML
* ************************************ */
Util.buildVehicleGrid = async function (data) {
  let grid
  if (data) {
    grid = '<article id="vehicleCard">'
    grid += '<img src="' + data.inv_image
    + '" alt="Image of ' + data.inv_make + ' ' + data.inv_model
    + ' on CSE Motors" />'
    grid += '<ul class="vehicleDetails">'
    grid += '<li>' + data.inv_make + ' ' + data.inv_model + ' Details </li>'
    grid += '<li> Price: $'
    + new Intl.NumberFormat('en-US').format(data.inv_price) + '</li>'
    grid += '<li> Description: <span>' + data.inv_description + '</span></li>'
    grid += '<li>Color: <span>' + data.inv_color + '</span></li>'
    grid += '<li>Miles: <span>'
    + new Intl.NumberFormat('en-US').format(data.inv_miles) + '</span></li>'
    grid += '</ul>'
    grid += '</article>'
  } else {
    grid = '<p class="notice-bad">Sorry, the vehicle could not be found.</p>'
  }
  return grid
}

/* **************************************
* Build the classification dropdown list
* ************************************ */
Util.buildClassificationList = async function (classification_id = null) {
    let data = await invModel.getClassifications()
    let classificationList =
      '<select name="classification_id" id="classificationList" required>'
    classificationList += '<option value="">Choose a Classification</option>'
    data.rows.forEach((row) => {
      classificationList += '<option value="' + row.classification_id + '"'
      if (
        classification_id != null &&
        row.classification_id == classification_id
      ) {
        classificationList += ' selected '
      }
      classificationList += '>' + row.classification_name + '</option>'
    })
    classificationList += '</select>'
    return classificationList
  }

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
 if (req.cookies.jwt) {
  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   function (err, accountData) {
    if (err) {
     req.flash("notice-bad", "Please log in.") // I ADDED 'notice-bad' TO THIS
     res.clearCookie("jwt")
     return res.redirect("/account/login")
    }
    res.locals.accountData = accountData
    res.locals.loggedin = 1
    next()
   })
 } else {
  next()
 }
}

/* ****************************************
* Middleware to check login
**************************************** */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice-bad", "Please log in.")
    return res.redirect("/account/login")
  }
}

/* ****************************************
* Middleware to check if account type is employee or admin
**************************************** */
Util.checkUserAuthority = (req, res, next) => {
  if (res.locals.accountData.account_type === 'Employee' || res.locals.accountData.account_type === 'Admin') {
    next()
  } else {
    req.flash("notice-bad", "Insufficient Credentials - Access Denied")
    return res.redirect("/account/login")
  }
}

module.exports = Util