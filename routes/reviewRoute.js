// Needed Resources
const express = require("express")
const router = new express.Router()
const reviewController = require("../controllers/reviewController")
const utilities = require("../utilities/")

// Route to build the add review view
router.get("/", utilities.handleErrors(reviewController.buildAddReview))

// Handle POST requests to add a new review
router.post(
    "/add-review",
    revValidate.reviewRules(),
    revValidate.checkRevData,
    utilities.handleErrors(reviewController.addReview)
)

module.exports = router;