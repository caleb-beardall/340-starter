const utilities = require(".")
const inventoryModel = require("../models/inventory-model")
const { body, validationResult } = require("express-validator")
const validate = {}

/* ****************************************
*  Classification Validation Rules
* *************************************** */
validate.classificationRules = () => {
    return [
        // classification rules
        body("classification_name")
            .trim()
            .isLength({ min: 3 })
            .withMessage("Classification name must be at least 3 characters long.")
            .matches(/^[A-Za-z]+$/)
            .withMessage("A valid classification name is required.")
            .custom(async (classification_name) => {
                const classificationExists = await inventoryModel.checkExistingClassification(classification_name)
                if (classificationExists) {
                    throw new Error("Classification already exists.")
                }
            })
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

module.exports = validate