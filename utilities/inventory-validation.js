const utilities = require(".")
const inventoryModel = require("../models/inventory-model")
const { body, validationResult } = require("express-validator")
const validate = {}

/* ****************************************
*  Classification Validation Rules
* *************************************** */
validate.classificationRules = () => {
    return [
        // classification name rules
        body("classification_name")
            .trim()
            .isLength({ min: 3 })
            .withMessage("Classification name must be at least 3 characters long.")
            .matches(/^[A-Za-z]+$/)
            .withMessage("A valid classification name is required.")
            .custom(async (classification_name) => {
                const classificationExists = await inventoryModel.checkExistingClassificationName(classification_name)
                if (classificationExists) {
                    throw new Error("Classification already exists.")
                }
            })
    ]
}

/* ****************************************
*  Inventory Validation Rules
* *************************************** */
validate.inventoryRules = () => {
    return [
        // classification id rules
        body("classification_id")
            .notEmpty()
            .withMessage("Please choose a classification.")
            .custom(async (classification_id) => {
                const classificationExists = await inventoryModel.checkExistingClassificationId(classification_id)
                if (!classificationExists) {
                    throw new Error("Classification not found.")
                }
            }),
        
        // inventory make rules
        body("inv_make")
            .trim()
            .notEmpty()
            .withMessage("Make is required.")
            .isLength({ min: 3 })
            .withMessage("Make must be at least 3 characters long.")
            .matches(/^[A-Za-z0-9\- ]+$/)
            .withMessage("Make may only contain letters, numbers, spaces, and dashes."),
        
        // inventory model rules
        body("inv_model")
            .trim()
            .notEmpty()
            .withMessage("Model is required.")
            .isLength({ min: 3 })
            .withMessage("Model must be at least 3 characters long.")
            .matches(/^[A-Za-z0-9\- ]+$/)
            .withMessage("Model may only contain letters, numbers, spaces, and dashes."),
        
        // inventory description rules
        body("inv_description")
            .trim()
            .notEmpty()
            .withMessage("Description is required.")
            .isLength({ min: 3 })
            .withMessage("Description must be at least 3 characters long."),
        
        // inventory image rules
        body("inv_image")
            .trim()
            .notEmpty()
            .withMessage("Image path is required.")
            .matches(/^\/images\/vehicles\/[A-Za-z0-9_\-]+\.(png|jpg|jpeg|gif)$/i)
            .withMessage("Image path must be a valid file in /images/vehicles/ with an image extension."),
        
        // inventory thumbnail rules
        body("inv_thumbnail")
            .trim()
            .notEmpty()
            .withMessage("Thumbnail path is required.")
            .matches(/^\/images\/vehicles\/[A-Za-z0-9_\-]+\.(png|jpg|jpeg|gif)$/i)
            .withMessage("Thumbnail path must be a valid file in /images/vehicles/ with an image extension."),
        
        // inventory price rules
        body("inv_price")
            .trim()
            .notEmpty()
            .withMessage("Price is required.")
            .matches(/^\d+(\.\d{1,2})?$/)
            .withMessage("Enter a valid price (whole number or up to 2 decimal places)."),
        
        // inventory year rules
        body("inv_year")
            .trim()
            .notEmpty()
            .withMessage("Year is required.")
            .matches(/^\d{4}$/)
            .withMessage("Year must be exactly 4 digits."),
        
        // inventory miles rules
        body("inv_miles")
            .trim()
            .notEmpty()
            .withMessage("Miles is required.")
            .matches(/^\d+$/)
            .withMessage("Miles must be digits only—no commas or decimals."),
        
        // inventory color rules
        body("inv_color")
            .trim()
            .notEmpty()
            .withMessage("Color is required.")
            .isLength({ min: 3 })
            .withMessage("Color must be at least 3 characters long.")
            .matches(/^[A-Za-z0-9\- ]+$/)
            .withMessage("Color may only contain letters, numbers, spaces, and dashes.")
    ]
}

/* ****************************************
*  Check data and return errors or continue to classification
* *************************************** */
validate.checkClassData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            errors,
            title: "Add New Classification",
            nav
        })
        return
    }
    next()
}

/* ****************************************
*  Check data and return errors or continue to inventory
* *************************************** */
validate.checkInvData = async (req, res, next) => {
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
    const classificationList = await utilities.buildClassificationList(req.body.classification_id)
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-inventory", {
            errors,
            title: "Add New Inventory",
            nav,
            classificationList,
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
        })
        return
    }
    next()
}

/* ****************************************
*  Check data and return errors or continue to update
* *************************************** */
validate.checkUpdateData = async (req, res, next) => {
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
    const classificationList = await utilities.buildClassificationList(req.body.classification_id)
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        const itemName = `${req.body.inv_make} ${req.body.inv_model}`
        res.render("inventory/edit-inventory", {
            errors,
            title: "Edit " + itemName,
            nav,
            classificationList,
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
        return
    }
    next()
}

module.exports = validate