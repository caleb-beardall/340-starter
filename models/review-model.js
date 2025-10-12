const pool = require("../database/")

/* ***************************
 *  Add new review
 * ************************** */
async function createReview(review_title, review_content, review_stars) {
  try {
    const sql = `
      INSERT INTO review
      (review_title, review_content, review_stars)
      VALUES ($1,$2,$3)
      RETURNING *
    `
    return await pool.query(sql, [review_title, review_content, review_stars])
  } catch (error) {
    return error.message
  }
}

module.exports = { createReview }