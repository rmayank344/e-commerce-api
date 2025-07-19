const response_handler = require("./response_handler");

function handleCaughtError(err, res) {
  // console.error(err);

  const isProd = process.env.DEPLOYMENT === 'prod';
  const message = isProd
    ? 'Something went wrong'
    : `Something went wrong: ${err}`;

  return response_handler.send_error_response(res, message, 500);
}

module.exports = handleCaughtError;