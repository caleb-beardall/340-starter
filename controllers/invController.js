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
  const accountNav = await utilities.getAccountNav(req, res)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " Vehicles",
    accountNav,
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
  const accountNav = await utilities.getAccountNav(req, res)
  let nav = await utilities.getNav()
  const yearMakeModel = `${data.inv_year} ${data.inv_make} ${data.inv_model}`
  res.render("./inventory/vehicle", {
    title: yearMakeModel,
    accountNav,
    nav,
    grid
  })
}

/* ***************************
 *  Deliver add new classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  const accountNav = await utilities.getAccountNav(req, res)
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    accountNav,
    nav,
    errors: null
  })
}

/* ***************************
 *  Deliver add new inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  const accountNav = await utilities.getAccountNav(req, res)
  let nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList()
  res.render("./inventory/add-inventory", {
    title: "Add New Inventory",
    accountNav,
    nav,
    classificationList,
    errors: null
  })
}

/* ***************************
 *  Process new classification
 * ************************** */
invCont.addClassification = async function (req, res) {
  const accountNav = await utilities.getAccountNav(req, res)
  let nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList()
  const { classification_name } = req.body
  
  const classResult = await invModel.createClassification(classification_name)
  if (classResult) {
    const accountNav = await utilities.getAccountNav(req, res)
    nav = await utilities.getNav()
    req.flash("notice-good", `The ${classification_name} classification was successfully added to inventory.`
    )
    res.status(201).render("inventory/inventory-management", {
      title: "Inventory Management",
      accountNav,
      nav,
      classificationList,
      errors: null
    })
  } else {
    req.flash("notice-bad", "Sorry, the classification update failed.")
    req.status(501).render("inventory/add-classification", {
      title: "Add New Classification",
      accountNav,
      nav
    })
  }
}

/* ***************************
 *  Process new inventory
 * ************************** */
invCont.addInventory = async function (req, res) {
  const accountNav = await utilities.getAccountNav(req, res)
  let nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList()
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color
  } = req.body
  
  const invResult = await invModel.createInventory(
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color
  )

  if (invResult) {
    req.flash(
      "notice-good", `The ${inv_make} ${inv_model} was successfully added to inventory.`
    )
    res.status(201).render("inventory/inventory-management", {
      title: "Inventory Management",
      accountNav,
      nav,
      classificationList,
      errors: null
    })
  } else {
    req.flash("notice-bad", "Sorry, the inventory update failed.")
    res.status(501).render("inventory/add-inventory", {
      title: "Add New Inventory",
      accountNav,
      nav,
      classificationList
    })
  }
}

/* ***************************
 *  Build inventory management view
 * ************************** */
invCont.buildInvManagement = async function (req, res, next) {
  const accountNav = await utilities.getAccountNav(req, res)
  let nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList()
  res.render("./inventory/inventory-management", {
    title: "Inventory Management",
    accountNav,
    nav,
    classificationList,
    errors: null
  })
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Deliver edit inventory view
 * ************************** */
invCont.buildEditInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  const accountNav = await utilities.getAccountNav(req, res)
  let nav = await utilities.getNav()
  const itemData = await invModel.getVehicleByInventoryId(inv_id)
  const classificationList = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    accountNav,
    nav,
    classificationList: classificationList,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  Process inventory update
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  const accountNav = await utilities.getAccountNav(req, res)
  let nav = await utilities.getNav()
  const {
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
    inv_id
  } = req.body

  const updateResult = await invModel.updateInventory(
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
    inv_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice-good", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationList = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice-bad", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      accountNav,
      nav,
      classificationList: classificationList,
      errors: null,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      inv_id
    })
  }
}

/* ***************************
 *  Deliver delete inventory view
 * ************************** */
invCont.buildDeleteInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  const accountNav = await utilities.getAccountNav(req, res)
  let nav = await utilities.getNav()
  const itemData = await invModel.getVehicleByInventoryId(inv_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    accountNav,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_price: itemData.inv_price,
    inv_year: itemData.inv_year
  })
}

/* ***************************
 *  Process inventory delete
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  const inv_id = parseInt(req.body.inv_id)

  const deleteResult = 0 // await invModel.deleteInventory(inv_id)

  if (deleteResult) {
    req.flash("notice-good", "The deletion was successful.")
    res.redirect("/inv/")
  } else {
    req.flash("notice-bad", "Sorry, the deletion failed.")
    res.redirect("/inv/delete/" + inv_id)
  }
}

module.exports = invCont