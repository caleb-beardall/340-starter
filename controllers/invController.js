const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " Vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build vehicle by inventory id
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inventoryId = req.params.inventoryId
  const data = await invModel.getVehicleByInventoryId(inventoryId)
  const grid = await utilities.buildVehicleGrid(data)
  let nav = await utilities.getNav()
  const yearMakeModel = `${data.inv_year} ${data.inv_make} ${data.inv_model}`
  res.render("./inventory/vehicle", {
    title: yearMakeModel,
    nav,
    grid
  })
}

/* ***************************
 *  Build inventory management view
 * ************************** */
invCont.buildInvManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  const grid = await utilities.buildInvManagementGrid()
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    grid
  })
}

/* ***************************
 *  Deliver add new classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null
  })
}

/* ***************************
 *  Process new classification
 * ************************** */
invCont.addClassification = async function (req, res) {
  let nav = await utilities.getNav()
  const grid = await utilities.buildInvManagementGrid()
  const { classification_name } = req.body
  
  const classResult = await invModel.createClassification(classification_name)
  if (classResult) {
    nav = await utilities.getNav()
    req.flash("notice", `The ${classification_name} classification has been added to inventory.`
    )
    res.status(201).render("inventory/management", {
      title: "Inventory Management",
      nav,
      grid,
      errors: null
    })
  } else {
    req.flash("notice", "Sorry, the inventory update failed.")
    req.status(501).render("inventory/add-classification", {
      title: "Add New Classification",
      nav
    })
  }
}

module.exports = invCont