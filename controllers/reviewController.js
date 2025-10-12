const reviewModel = require("../models/review-model")
const utilities = require("../utilities/")

const revCont = {}

/* ***************************
 *  Deliver review management view
 * ************************** */
revCont.buildRevManagement = async function (req, res, next) {
    const accountNav = await utilities.getAccountNav(req, res)
    let nav = await utilities.getNav()
    res.render("./review/review-management", {
        title: "Review Management",
        accountNav,
        nav,
        errors: null
    })
}

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

/* ***************************
 *  Process new review
 * ************************** */
revCont.addReview = async function (req, res) {
    const accountNav = await utilities.getAccountNav(req, res)
    let nav = await utilities.getNav()
    const { review_title, review_content, review_stars } = req.body

    const revResults = await reviewModel.createReview(
        review_title,
        review_content,
        review_stars
    )

    if (revResults) {
        req.flash("notice-good", `Review titled '${review_title}' was successfully received.`)
        res.status(201).render("review/review-management", {
            title: "Review Management",
            accountNav,
            nav,
            errors: null
        })
    } else {
        req.flash("notice-bad", "Sorry, there was an error processing the review.")
        res.status(501).render("review/add-review", {
            title: "Leave Review",
            accountNav,
            nav
        })
    }
}


module.exports = revCont