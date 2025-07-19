// Utils
const handleCaughtError = require("../utils/handle_error");
const response_handler = require("../utils/response_handler");

// Models
const category_model = require("../models/category_model");
const product_model = require("../models/product_model");
const cart_model = require("../models/cart_model");

/**
 * 
 * ENDPOINT : /api/admin/v1/product-service/add_cart
 * Table used : cart_model
 * 
 */

const add_update_cart = async (req, res) => {
  let max_limit = 4;
  try {
    const { product_id, quantity, is_active } = req.body;
    if (is_active) {
      const product_stock = await product_model.findOne({ where: { product_id: product_id, is_active: true }, attributes: ['stock'], raw: true });
      if (!product_stock || product_stock.stock < quantity) return response_handler.send_error_response(res, "That Quantity is not in stock.", 400);
    }
    const cart = await cart_model.findOne({ where: { user_id: req.id, product_id: product_id, is_active: true }, raw: true });
    if (cart) {
      await cart_model.update(
        { quantity: quantity, is_active: is_active },
        {
          where: {
            user_id: req.id,
            product_id: product_id,
          }
        }
      );
      if (is_active == false && quantity === 0) {
        await cart_model.destroy({ where: { user_id: req.id, product_id: product_id } });
        return response_handler.send_success_response(res, "product removed from cart.", 200);
      }
      return response_handler.send_success_response(res, "cart updated!.", 200);
    }
    else {
      // also if user want to remove that product so then product that should be deleted from array
      const total_cart_item = await cart_model.count({ where: { user_id: req.id, is_active: true } });
      if (total_cart_item === max_limit) return response_handler.send_error_response(res, `cart item reached maximum limit ${max_limit}`, 400);
      await cart_model.create({
        user_id: req.id,
        product_id: product_id,
        quantity: quantity,
        is_active: is_active
      });
      return response_handler.send_success_response(res, "product added in cart.", 200);
    }
  }
  catch (err) {
    return handleCaughtError(err, res);
  }
};

/**
 * 
 * ENDPOINT : /api/admin/v1/product-service/get_cart
 * Table used : cart_model
 * 
 */

const get_cart_items = async (req, res) => {
  try {
    const get_cart = await cart_model.findAll({ where: { user_id: req.id, is_active: 1 }, attributes: ['product_id', 'quantity'], raw: true });
    const productIds = get_cart.map((id) => id.product_id);
    const all_product = await product_model.findAll({ where: { product_id: productIds }, raw: true });

    const quantityMap = {};
    get_cart.forEach((item) => {
      quantityMap[item.product_id] = item.quantity;
    });

    const product_detail = all_product.map((data) => ({
      product_id: data.product_id,
      name: data.name,
      description: data.description,
      price: data.price,
      quantity: quantityMap[data.product_id]
    }));
    return response_handler.send_success_response(res, product_detail, 200);
  }
  catch (err) {
    return handleCaughtError(err, res);
  }
};

module.exports = { add_update_cart, get_cart_items };