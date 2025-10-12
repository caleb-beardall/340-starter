const utilities = require(".")
const reviewModel = require("../models/review-model")
const { body, validationResult } = require("express-validator")

const validate = {}

/* ****************************************
*  Review Validation Rules
* *************************************** */
validate.reviewRules = () => {
    return [
        // review title rules
        body("review_title")
            .trim()
            .isLength({ min: 3, max: 100 })
            .withMessage("Title must be between 3 and 100 characters.")
            .matches(/^[A-Za-z0-9 ,.!?"'-]+$/)
            .withMessage("Title contains invalid characters."),

        // review content rules
        body("review_content")
            .trim()
            .isLength({ min: 10, max: 1000 })
            .withMessage("Content must be between 10 and 1000 characters.")
            .matches(/^[A-Za-z0-9 ,.!?"'()\-\n\r]+$/)
            .withMessage("Content contains invalid characters."),

        // review stars rules
        body("review_stars")
            .isInt({ min: 1, max: 5 })
            .withMessage("Stars must be an integer between 1 and 5."),
    ]
}

/* ****************************************
*  Check data and return errors or continue to review
* *************************************** */

module.exports = validate