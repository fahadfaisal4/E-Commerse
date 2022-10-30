var express = require("express");
var router = express.Router();
var productHelper = require("../helpers/product-helpers");
/* GET users listing. */
router.get("/", function (req, res, next) {
  productHelper.getAllProducts().then((products) => {
    res.render("admin/view-products", { admin: true, products: products });
  });
});

router.get("/add-products", (req, res) => {
  res.render("admin/add-product");
});


router.post("/add-products", function (req, res) {
  productHelper.addProduct(req.body, (imgId) => {
    let image = req.files.image ? req.files.image : ""
    image.mv(
      `/root/Desktop/Projects/E-commerce/public/images/product-images/${imgId}.jpg`,
      (err, done) => {
        if (!err) {
          console.log(
            `Product Image was uploaded public/images/product-images/${imgId}.jpg}`
          );
        } else {
          console.log(err);
        }
      }
    );
  });
  res.redirect("/")
});

router.get("/delete-product", (req, res) => {
  const productId = req.query.product_id
  productHelper.deleteProduct(productId)
  res.redirect("/")
})

router.get(`/edit-product/:id`, async (req, res) => {
  const product = await productHelper.getProduct(req.params.id)
  res.render("admin/edit-product", { product });
});

router.post('/edit-product', async (req, res) => {
  productHelper.editProduct(req.query.id, req.body).then(() => {
    if (req.files) {
      const image = req.files.image
      image.mv(`/root/Desktop/Projects/E-commerce/public/images/product-images/${req.query.id}.jpg`)
    }
    res.redirect("/admin")
  })
});


module.exports = router;
