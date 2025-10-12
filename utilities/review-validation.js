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
            .matches(/^[A-Za-z0-9 ,.!?"'-]+$/)
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
validate.checkRevData = async (req, res, next) => {
    const { review_title, review_content, review_stars } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        const accountNav = await utilities.getAccountNav(req, res)
        let nav = await utilities.getNav()
        res.render("review/add-review", {
            errors,
            title: "Leave Review",
            accountNav,
            nav,
            review_title,
            review_content,
            review_stars
        })
        return
    }
    next()
}

module.exports = validate