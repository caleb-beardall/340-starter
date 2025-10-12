const reviewModel = require("../models/review-model")
const utilities = require("../utilities/")

const revCont = {}

/* ***************************
 *  Deliver add new review view
 * ************************** */
revCont.buildAddReview = async function (req, res, next) {
    const accountNav = await utilities.getAccountNav(req, res)
    let nav = await utilities.getNav()
    res.render("./review/add-review", {
        title: "Leave Review",
        accountNav,
        nav,
        errors: null
    })
}

module.exports = revCont