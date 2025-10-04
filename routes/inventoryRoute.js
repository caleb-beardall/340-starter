// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

// Route to build a specific vehicle using its id
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId))

// Route to build the add classification view
router.get(
    "/add-classification",
    utilities.checkLogin,
    utilities.handleErrors(invController.buildAddClassification))

// Route to build the add inventory view
router.get(
    "/add-inventory",
    utilities.checkLogin,
    utilities.handleErrors(invController.buildAddInventory))

// Handle POST requests to add a new classification
router.post(
    "/add-classification",
    invValidate.classificationRules(),
    invValidate.checkClassData,
    utilities.handleErrors(invController.addClassification))

// Handle POST request to add a new inventory
router.post(
    "/add-inventory",
    invValidate.inventoryRules(),
    invValidate.checkInvData,
    utilities.handleErrors(invController.addInventory))

// Route to build the inventory management view
router.get(
    "/",
    utilities.checkLogin,
    utilities.handleErrors(invController.buildInvManagement))

// Route to build getInventory using classification id
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Route to build the edit inventory view
router.get("/edit/:inv_id",
    utilities.checkLogin,
    utilities.handleErrors(invController.buildEditInventory))

// Handle POST request to update inventory
router.post("/update/",
    invValidate.inventoryRules(),
    invValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory))

module.exports = router;