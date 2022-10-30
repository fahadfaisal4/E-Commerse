const { response } = require("express");
const express = require("express");
const router = express.Router();
const productHelper = require("../helpers/product-helpers");
const userHelpers = require("../helpers/user-helpers");
const routeHelpers = require("../helpers/routing-hellpers.js")

/* GET home page. */
router.get("/", function (req, res, next) {
  let user = req.session.user;
  productHelper.getAllProducts().then((products) => {
    res.render("user/view-products", { products, user });
  });
});

router.get("/login", (req, res) => {
  routeHelpers.routingHelp(req, res, "/login")
});

router.post("/login", (req, res) => {
  userHelpers.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.loggeIn = true;
      req.session.user = response.user;

      res.redirect("/");
    } else {
      req.session.loginErr = true
      res.redirect("/login");
    }
  });
});


router.get("/signup", (req, res) => {
  routeHelpers.routingHelp(req, res, "/signup")
});

router.post("/signup", (req, res) => {
  userHelpers.doSignup(req.body).then((response) => {
    res.render("user/sign-success");
    req.session.loggeIn = true
    req.session.user = response
  });
});

router.get("/cart", (req, res) => {
  routeHelpers.authTesting(req, res, "/cart")
  const cartProds = userHelpers.getCartProducts(req.session.user._id)
})

router.get("/add-to-cart/:id", (req, res) => {
  if(req.session.loggeIn){
    userHelpers.addToCart(req.params.id, req.session.user._id).then(() => {
      res.redirect("/")
    })
  }else(
    res.redirect("/login")
  )
})

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});


module.exports = router;
