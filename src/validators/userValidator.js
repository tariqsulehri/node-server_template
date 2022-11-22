const Joi = require("joi");
const composeResponse = require("../helpers/componseResponse");
const HttpCodes = require("../constants/httpCodes");
const AppMessages = require("../constants/appMessages");

exports.validateBody = async (body) => {
  if (!body || Object.keys(body).length === 0) {
    return false;
  }

  return true;
};

exports.validateCreateUser = async (req, res, next) => {
  var { body } = req;

  if (!this.validateBody(body)) {
    var errorResponse = composeResponse.genericError(
      AppMessages.ERROR,
      AppMessages.APP_ERROR_CODE,
      AppMessages.APP_ERROR_INVALID_REQUEST
    );
    return res.status(HttpCodes.BAD_REQUEST).send(errorResponse);
  }

  const schema = Joi.object({
    id: Joi.string().allow(null).allow("").optional(),
    company_id: Joi.string().required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    display_name: Joi.string().required(),
    email: Joi.string().email().required(),
    role: Joi.string().required(),
    password: Joi.string().required(),
  });

  try {
    let validationResult = await schema.validateAsync(body);
    next();
  } catch (error) {
    var errorResponse = composeResponse.genericError(
      AppMessages.ERROR,
      AppMessages.APP_ERROR_CODE,
      AppMessages.APP_ERROR_INVALID_REQUEST
    );
    return res.status(HttpCodes.BAD_REQUEST).send(errorResponse);
  }
};

exports.validateChangePassword = async (req, res, next) => {
  var { body } = req;

  if (!this.validateBody(body)) {
    var errorResponse = composeResponse.genericError(
      AppMessages.ERROR,
      AppMessages.APP_ERROR_CODE,
      AppMessages.APP_ERROR_INVALID_REQUEST
    );
    return res.status(HttpCodes.BAD_REQUEST).send(errorResponse);
  }

  const schema = Joi.object({
    id: Joi.string().required(),
    email: Joi.string().email().required(),
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required(),
  });

  try {
    validationResult = await schema.validateAsync(body);
    next();
  } catch (error) {
    var errorResponse = composeResponse.genericError(
      AppMessages.ERROR,
      AppMessages.APP_ERROR_CODE,
      AppMessages.APP_ERROR_INVALID_REQUEST
    );
    return res.status(HttpCodes.BAD_REQUEST).send(errorResponse);
  }
};

exports.validateUserLogin = async (req, res, next) => {
  var { body } = req;

  if (!this.validateBody(body)) {
    var errorResponse = composeResponse.genericError(
      AppMessages.ERROR,
      AppMessages.APP_ERROR_CODE,
      AppMessages.APP_ERROR_INVALID_REQUEST
    );
    return res.status(HttpCodes.BAD_REQUEST).send(errorResponse);
  }

  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  try {
    validationResult = await schema.validateAsync(body);
    next();
  } catch (error) {
    var errorResponse = composeResponse.genericError(
      AppMessages.ERROR,
      AppMessages.APP_ERROR_CODE,
      AppMessages.APP_ERROR_INVALID_REQUEST
    );

    return res.status(HttpCodes.BAD_REQUEST).send(errorResponse);
  }
};

exports.validateUpdatedUser = async (req, res, next) => {
  var { body } = req;

  if (!this.validateBody(body)) {
    var errorResponse = composeResponse.genericError(
      AppMessages.ERROR,
      AppMessages.APP_ERROR_CODE,
      AppMessages.APP_ERROR_INVALID_REQUEST
    );
    return res.status(HttpCodes.BAD_REQUEST).send(errorResponse);
  }

  const schema = Joi.object({
    id: Joi.string().required(),
    company_id: Joi.string().required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    display_name: Joi.string().required(),
    email: Joi.string().email().required(),
    role: Joi.string().required(),
    password: Joi.string().required(),
  });

  try {
    validationResult = await schema.validateAsync(body);
    next();
  } catch (error) {
    var errorResponse = composeResponse.genericError(
      AppMessages.ERROR,
      AppMessages.APP_ERROR_CODE,
      AppMessages.APP_ERROR_INVALID_REQUEST
    );
    return res.status(HttpCodes.BAD_REQUEST).send(errorResponse);
  }
};
