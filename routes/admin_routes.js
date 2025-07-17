const express = require('express');
const router = new express.Router();

const {validate_auth_token, admin_access} = require("../middleware/authentication");

const {create_category, create_product, update_product} = require("../controller/product_cntrll");

// create category routes
router.post("/add_category", validate_auth_token, admin_access, create_category);

// create product routes
router.post("/add_product", validate_auth_token, admin_access, create_product);

// update and delete product routes (for delete product only send is_active = false from req.body and the product will deactive in database.)
router.put("/update_product", validate_auth_token, admin_access, update_product);


module.exports = router;