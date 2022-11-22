const jwt = require("jsonwebtoken");
const HttpCodes = require("../constants/httpCodes");
const AppMessages = require("../constants/appMessages");
const composeResponse = require("../helpers/componseResponse");

function auth(req, res, next) {
  next(); //to remove this in prod
  return;
  const token = req.header("x-auth-token");

  if (!token) {
    var errorResponse = composeResponse.genericError(
      AppMessages.APP_ERROR,
      AppMessages.APP_ERROR_CODE,
      AppMessages.APP_ACCESS_DENIED
    );

    return res.status(HttpCodes.FORBIDDEN).send(errorResponse);
  }

  try {
    const decoded = jwt.verify(token, "cw_jwtPrivateKey");
    req.user = decoded;
    next();
  } catch (ex) {
    var errorResponse = composeResponse.genericError(
      AppMessages.APP_ERROR,
      AppMessages.APP_ERROR_CODE,
      AppMessages.APP_ACCESS_DENIED
    );
    return res.status(HttpCodes.FORBIDDEN).send(errorResponse);
  }
}

module.exports = auth;
