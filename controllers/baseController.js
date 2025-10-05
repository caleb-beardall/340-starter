const utilities = require("../utilities/") // imports an index.js file
const baseController = {}

baseController.buildHome = async function(req, res){
  const accountNav = await utilities.getAccountNav(req, res)
  const nav = await utilities.getNav()
  res.render("index", {
    title: "Home",
    accountNav,
    nav
  })
}

module.exports = baseController