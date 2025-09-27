const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
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
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
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
    grid = '<p class="notice">Sorry, the vehicle could not be found.</p>'
  }
  return grid
}

/* **************************************
* Build the inventory management menu HTML
* ************************************ */
Util.buildInvManagementGrid = async function () {
  let grid = '<a href="../../inv/add-classification" title="View add new classification form">Add New Classification</a>'
  grid += '<br>'
  grid += '<a href="../../inv/add-vehicle" title="View add new vehicle form">Add New Vehicle</a>'
  return grid
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util