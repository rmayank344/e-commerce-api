const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const auth_configs = require("../config/auth_config.json");

// utils
const response_handler = require("../utils/response_handler");
const handleCaughtError = require("../utils/handle_error");

// models
const user_model = require("../models/user_model");

/**
 * 
 * ENDPOINT : /api/user/v1/auth-service/signup
 * Table used : user_model
 * 
 */

const user_signup = async (req, res) => {
  try {
    const api_key = req.header('x-api-key');
    if (!api_key) return response_handler.send_error_response(res, "Api key is missing.", 404);

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return response_handler.send_error_response(
        res, "Name, Email and Password are required.", 404
      )
    }
    const check_email = await user_model.findOne({ where: { email: email }, raw: true });
    if (check_email) return response_handler.send_error_response(res, "Email already exits.", 400);
    const hashedPassword = await bcrypt.hash(password, 10);
    const auth_config = auth_configs[api_key];
    const create_user = await user_model.create({
      name: name,
      email: email,
      password: hashedPassword,
      role: auth_config.role,
    });
    return response_handler.send_success_response(
      res, "user signup successfully.", 201
    )
  }
  catch (err) {
    console.log(err)
    return handleCaughtError(err, res);
  }
};

/**
 * 
 * ENDPOINT : /api/user/v1/auth-service/login
 * Table used : user_model
 * 
 */

const user_login = async (req, res) => {
  try {
    const api_key = req.header('x-api-key');
    if (!api_key) {
      return response_handler.send_error_response(
        res, "Api key is missing", 404
      );
    }
    const { email, password } = req.body;
    if (!email || !password) {
      return response_handler.send_error_response(
        res, "Email and Password are required.", 404
      )
    }
    const user = await user_model.findOne({ where: { email: email }, raw: true });
    if (!user) return response_handler.send_error_response( res, "User not found. Please signup.", 400,)
    const auth_config = auth_configs[api_key];
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) return response_handler.send_error_response(res, "Login credentials wrong.", 400);
    else {
      let token_payload = null;
      let auth_token = null;
      token_payload = {
        id: user.user_id,
        email: user.email,
        role: user.role,
      };
      auth_token = jwt.sign(token_payload, auth_config.secret_key_auth, { expiresIn: process.env.AUTH_TOKEN_EXPIRES });
      return response_handler.send_success_response(
        res, { message: "user loggin successfully.", "user:":user, "auth_token": auth_token }, 200
      );
    }
  }
  catch (err) {
    return handleCaughtError(err, res);
  }
};


module.exports = { user_signup, user_login};