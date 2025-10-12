// Needed Resources
const express = require("express")
const router = new express.Router()
const reviewController = require("../controllers/reviewController")
const utilities = require("../utilities/")
const revValidate = require("../utilities/review-validation")

// Route to build the review management view
router.get("/", utilities.handleErrors(reviewController.buildRevManagement))

// Route to build the add review view
router.get("/add-review", utilities.handleErrors(reviewController.buildAddReview))

// Handle POST requests to add a new review
router.post(
    "/add-review",
    revValidate.reviewRules(),
    revValidate.checkRevData,
    utilities.handleErrors(reviewController.addReview)
)

module.exports = router;