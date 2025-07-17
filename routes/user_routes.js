const express = require('express');
const router = new express.Router();

const {validate_auth_token} = require("../middleware/authentication");

const {user_signup, user_login} = require("../controller/auth_cntrll");
const {get_all_category, get_category_brand, get_product, get_all_product} = require("../controller/product_cntrll");

// signup routes
router.post("/signup", user_signup);

// login routes
router.get("/login", user_login);

// get all category routes
router.get("/get_all_category", validate_auth_token, get_all_category);

// get category by brand routes
router.get("/get_category", validate_auth_token, get_category_brand);

// get category by brand routes
router.get("/get_product", validate_auth_token, get_product);

// get category by brand routes
router.get("/get_all_product", validate_auth_token, get_all_product);

module.exports = router;