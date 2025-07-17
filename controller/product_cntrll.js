
// Utils
const handleCaughtError = require("../utils/handle_error");
const response_handler = require("../utils/response_handler");

// Models
const category_model = require("../models/category_model");
const product_model = require("../models/product_model");

/**
 * 
 * ENDPOINT : /api/admin/v1/product-service/add_category
 * Table used : category_model
 * 
 */

const create_category = async (req, res) => {
  try {
    const { name, brand } = req.body;
    if (!name || !brand) return response_handler.send_error_response(res, "name and brand are required.", 400);
    const check_brand = await category_model.findOne({ where: { name: name, brand: brand }, raw: true });
    if (check_brand) return response_handler.send_error_response(res, "Brand Already added.", 403);

    const category = await category_model.create({
      name: name,
      brand: brand,
      is_active: true
    });
    return response_handler.send_success_response(res, "category added successfully.", 201);
  }
  catch (err) {
    return handleCaughtError(err, res);
  }
};

/**
 * 
 * ENDPOINT : /api/user/v1/product-service/get_all_category
 * Table used : category_model
 * 
 */
const get_all_category = async (req, res) => {
  try {
    const all_category = await category_model.findAll({ where: { is_active: 1 }, attributes: ['category_id', 'name', 'brand'], raw: true });

    const groupedMap = new Map();

    all_category.forEach(item => {
      if (!groupedMap.has(item.name)) {
        groupedMap.set(item.name, []);
      }
      groupedMap.get(item.name).push({
        category_id: item.category_id,
        brand: item.brand,
      });
    });
    // Convert Map to plain object if needed
    const groupedObj = Object.fromEntries(groupedMap.entries());
    return response_handler.send_success_response(res, groupedObj, 200);
  }
  catch (err) {
    return handleCaughtError(err, res);
  }
};

/**
 * 
 * ENDPOINT : /api/user/v1/product-service/get_category?name={}
 * Table used : category_model
 * 
 */

const get_category_brand = async (req, res) => {
  try {
    const { name } = req.query;
    const all_brand = await category_model.findAll({ where: { name: name, is_active: 1 }, attributes: ['category_id', 'brand'], raw: true });
    if (all_brand.length > 0) {
      return response_handler.send_success_response(res, { name, all_brand }, 200);
    }
    return response_handler.send_error_response(res, "category not available.", 404);
  }
  catch (err) {
    return handleCaughtError(err, res);
  }
};

/**
 * 
 * ENDPOINT : /api/user/v1/product-service/add_product
 * Table used : category_model
 * 
 */

const create_product = async (req, res) => {
  const userId = req.id;
  try {
    const { name, description, price, stock } = req.body;
    if (!name || !description || !price || !stock) return response_handler.send_error_response(res, "name,description,price,stock all required.", 400);
    const check_product = await product_model.findOne({ where: { name: name }, raw: true });
    if (check_product) return response_handler.send_error_response(res, "product already exits.", 401);

    const find_name = await category_model.findOne({ where: { brand: name, is_active: 1 }, raw: true });
    if (find_name != null) {
      await product_model.create({
        name: name,
        description: description,
        price: price,
        stock: stock,
        category_id: find_name.category_id,
        created_by: userId,
        is_active: true,
      });
      return response_handler.send_success_response(res, "product added successfully.", 201);
    }
    return response_handler.send_error_response(res, "product not available in category database.", 401);
  }
  catch (err) {
    return handleCaughtError(err, res);
  }
};

/**
 * 
 * ENDPOINT : /api/user/v1/product-service/get_product
 * Table used : category_model
 * 
 */

const get_product = async (req, res) => {
  try {
    const { product_id } = req.query;
    const product = await product_model.findOne({ where: { product_id: product_id, is_active: true }, raw: true });
    if (!product) return response_handler.send_error_response(res, "product not found.", 404);

    const keysToRemove = ["category_id", "is_active", "created_by"];
    const result = {};
    for (let key in product) {
      if (!keysToRemove.includes(key)) result[key] = product[key];
    }

    return response_handler.send_success_response(res, result, 200);
  }
  catch (err) {
    return handleCaughtError(err, res);
  }
};

/**
 * 
 * ENDPOINT : /api/user/v1/product-service/get_all_product
 * Table used : category_model
 * 
 */

const get_all_product = async (req, res) => {
  try {
    const product = await product_model.findAll(
      {
        where: { is_active: true },
        attributes: ['product_id', 'name', 'description', 'price', 'stock', 'category_id'],
        raw: true
      });

    const category_ids = [];
    for (const objectKey of product) {
      category_ids.push(objectKey.category_id);
    }

    const groupedCategory = new Map();
    const category_name = await category_model.findAll({where:{category_id: category_ids}, attributes:['category_id','name'], raw: true});
    for(const key of category_name){
      groupedCategory.set(key.category_id,key.name);
    }

    const groupedProduct = new Map();
    product.forEach(data => {
      const categoryName  = groupedCategory.get(data.category_id);
      if(!groupedProduct.has(categoryName )) groupedProduct.set(categoryName, []);
      const { category_id, ...product } = data;
      groupedProduct.get(categoryName).push({product});
    });
    const all_product = Object.fromEntries(groupedProduct.entries());
    return response_handler.send_success_response(res, all_product, 200);
  }
  catch (err) {
    return handleCaughtError(err, res);
  }
};

/**
 * 
 * ENDPOINT : /api/admin/v1/product-service/update_product
 * Table used : category_model
 * 
 */

const update_product = async (req, res) => {
  try{
    const {product_id} = req.query;
    const {price, stock, is_active} = req.body;
    const product = await product_model.findOne({where:{product_id: product_id}, raw: true});
    if(!product) return response_handler.send_error_response(res, "product not found.", 404);
    await product_model.update(
      {price: price, stock: stock, is_active: is_active},
      {
        where:{
          product_id: product_id
        }
      }
    );
    return response_handler.send_success_response(res, "product updated!.", 200);
  }
  catch(err){
    return handleCaughtError(err, res);
  }
};
module.exports = { create_category, get_all_category, get_category_brand, create_product, get_product, get_all_product, update_product };