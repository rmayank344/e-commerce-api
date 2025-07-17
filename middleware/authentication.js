const jwt = require('jsonwebtoken');
require('dotenv').config();
const auth_configs = require("../config/auth_config.json");
const response_handler = require("../utils/response_handler");
const handleCaughtError = require("../utils/handle_error");


// Validate Auth Token
const validate_auth_token = async (req, res, next) => {
  try {
    const api_key = req.header('x-api-key');
    if (!api_key) return response_handler.send_error_response(res, "API key is missing.", 404);

    const auth_token = req.header('x-auth-token');
    if (!auth_token) return response_handler.send_error_response(res, "Auth Token is missing.", 404);

    const auth_config = auth_configs[api_key];
    try {
      const token_verfied = jwt.verify(auth_token, auth_config.secret_key_auth);
      req.id = token_verfied.id,
      req.email = token_verfied.email,
      req.role = token_verfied.role
    }
    catch (err) {
      if (err.name === "TokenExpiredError") {
        return response_handler.send_error_response(
          res,
          "Auth token has expired. Please click on url.",
          401,
          { refresh_auth_token_url: REFRESH_AUTH_TOKEN_URL }
        );
      }
      return response_handler.send_error_response(
        res, 'Unauthorised auth token', 401
      )
    }
    next();
  }
  catch (err) {
    return handleCaughtError(err, res);
  }
};

// verified user role
const admin_access = async (req, res, next) => {
  try {
    if (req.role === 'customer') {
      return response_handler.send_error_response(
        res, "Only Admin can access this page.", 400
      )
    }
    next();
  }
  catch (err) {
    return handleCaughtError(err, res);
  }
};

module.exports = { validate_auth_token, admin_access };