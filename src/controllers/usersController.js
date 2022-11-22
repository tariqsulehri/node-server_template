const { adapterRequest } = require("../helpers/adapterRequest");
const composeResponse = require("../helpers/componseResponse");
const userService = require("../services/database/userService");
const authHelper = require("../helpers/authHelper");
const HttpCodes = require("../constants/httpCodes");
const AppMessages = require("../constants/appMessages");
const authService = require("../services/other/authService");

exports.getUserByEmail = async (req, res) => {
  var httpRequest = adapterRequest(req);
  try {
    var result = await userService.getUserByEmail(httpRequest);
    //Compose Response
    var response = composeResponse.success(
      httpRequest,
      1,
      AppMessages.RESPONSE_SUCCESSFULY_GENERATE,
      result,
      HttpCodes.OK
    );

    return res.status(HttpCodes.OK).send(response);
  } catch (error) {
    //Compose Error Response
    var errorResponse = composeResponse.genericError(
      AppMessages.ERROR,
      AppMessages.APP_ERROR_CODE,
      AppMessages.INTERNAL_SERVER_ERROR
    );
    return res.status(HttpCodes.INTERNAL_SERVER_ERROR).send(errorResponse);
  }
};

exports.login = async (req, res) => {
  var httpRequest = adapterRequest(req);

  try {
    var { body } = httpRequest;

    var result = await userService.login(body);

    //Compose Error Response
    if (!result) {
      var response = composeResponse.genericError(
        AppMessages.ERROR,
        AppMessages.APP_ERROR_CODE,
        AppMessages.APP_ERROR_MSG_IVALID_USERNAME_PASSWORD
      );
      return res.status(HttpCodes.BAD_REQUEST).send(response);
    }
    //Validate Paswword
    const isValidUser = await authHelper.isValidUser(
      body.password,
      result.password
    );
    //Compose Error Response if Password is Invalid.
    if (!isValidUser) {
      var errorResponse = composeResponse.validation(
        httpRequest,
        AppMessages.IVALID_USER_CREDENTIALS
      );
      return res.status(HttpCodes.BAD_REQUEST).send(errorResponse);
    }

    res = await authHelper.addAuthTokenInResponseHeader(result, res);
    var response = composeResponse.genericSuccess(
      AppMessages.APP_SUCCESS_CODE,
      AppMessages.SUCCESS,
      result
    );
    return res.status(HttpCodes.OK).send(response);
  } catch (error) {
    //Compose Error Response
    var errorResponse = composeResponse.genericError(
      AppMessages.ERROR,
      AppMessages.APP_ERROR_CODE,
      AppMessages.INTERNAL_SERVER_ERROR
    );
    return res.status(HttpCodes.INTERNAL_SERVER_ERROR).send(errorResponse);
  }
};

exports.createUser = async (req, res) => {
  var httpRequest = adapterRequest(req);

  try {
    var { body } = httpRequest;

    body.password = await authHelper.encryptString(body.password);

    var exists = await userService.getUserByEmail(body.email);
    if (exists) {
      var errorResponse = composeResponse.genericError(
        AppMessages.ERROR,
        AppMessages.APP_ERROR_CODE,
        AppMessages.APP_DUPLICATE
      );
      return res.status(HttpCodes.BAD_REQUEST).send(errorResponse);
    }

    var result = await userService.insertUser(body);
    //Api Call and Compose Response Response
    var response = composeResponse.genericSuccess(
      AppMessages.SUCCESS,
      AppMessages.RECORD_SUCCESSFULY_CREATED,
      body
    );
    return res.status(HttpCodes.CREATED).send(response);
  } catch (error) {
    //Compose Error Response
    var errorResponse = composeResponse.genericError(
      AppMessages.ERROR,
      AppMessages.APP_ERROR_CODE,
      AppMessages.INTERNAL_SERVER_ERROR
    );
    return res.status(HttpCodes.INTERNAL_SERVER_ERROR).send(errorResponse);
  }
};

exports.usersList = async (req, res) => {
  try {
    //Api Call and Compose Response Response
    // var users = await userService.getUsers();
    var users = await userService.getUsersWithCompany();
    var response = composeResponse.genericSuccess(
      AppMessages.SUCCESS,
      AppMessages.APP_RESULT_SUCCESSFULY_GENERATED,
      users
    );
    return res.status(HttpCodes.OK).send(response);
  } catch (error) {
    //Compose Error Response
    var errorResponse = composeResponse.genericError(
      AppMessages.ERROR,
      AppMessages.APP_ERROR_CODE,
      AppMessages.INTERNAL_SERVER_ERROR
    );
    return res.status(HttpCodes.INTERNAL_SERVER_ERROR).send(errorResponse);
  }
};

exports.getUser = async (req, res) => {
  try {
    //Api Call and Compose Response Response
    let id = req.params["id"];
    var user = await userService.getUserByID(id);
    var response = composeResponse.genericSuccess(
      AppMessages.SUCCESS,
      AppMessages.APP_RESULT_SUCCESSFULY_GENERATED,
      user
    );
    return res.status(HttpCodes.OK).send(response);
  } catch (error) {
    //Compose Error Response
    var errorResponse = composeResponse.genericError(
      AppMessages.ERROR,
      AppMessages.APP_ERROR_CODE,
      AppMessages.INTERNAL_SERVER_ERROR
    );
    return res.status(HttpCodes.INTERNAL_SERVER_ERROR).send(errorResponse);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    //Api Call and Compose Response Response
    let id = req.params["id"];
    var company = await userService.deleteUser(id);
    var response = composeResponse.genericSuccess(
      AppMessages.SUCCESS,
      AppMessages.APP_RESULT_SUCCESSFULY_GENERATED,
      company
    );
    return res.status(HttpCodes.OK).send(response);
  } catch (error) {
    //Compose Error Response
    var errorResponse = composeResponse.genericError(
      AppMessages.ERROR,
      AppMessages.APP_ERROR_CODE,
      AppMessages.INTERNAL_SERVER_ERROR
    );
    return res.status(HttpCodes.INTERNAL_SERVER_ERROR).send(errorResponse);
  }
};

exports.changeUserPassword = async (req, res) => {
  try {
    const { body } = req;

    var exists = await userService.getUserByID(body.id);
    if (!exists) {
      var response = composeResponse.genericError(
        AppMessages.ERROR,
        AppMessages.APP_ERROR_CODE,
        AppMessages.IVALID_USER_CREDENTIALS
      );
      return res.status(HttpCodes.BAD_REQUEST).send(response);
    }

    let isValidUser = await authService.isValidUser(
      body.oldPassword,
      exists.password
    );

    if (!isValidUser) {
      var response = composeResponse.genericError(
        AppMessages.ERROR,
        AppMessages.APP_ERROR_CODE,
        AppMessages.APP_ERROR_MSG_IVALID_USERNAME_PASSWORD
      );
      return res.status(HttpCodes.BAD_REQUEST).send(response);
    }

    let passwordHash = await authService.encryptString(body.newPassword);
    result = await userService.updateUserPassword(body.id, passwordHash);
    //Api Call and Compose Sucess Response Response
    var response = composeResponse.genericSuccess(
      AppMessages.SUCCESS,
      AppMessages.APP_PASSWORD_CHANGED,
      null
    );

    return res.status(HttpCodes.OK).send(response);
  } catch (error) {
    //Compose Error Response
    var errorResponse = composeResponse.genericError(
      AppMessages.ERROR,
      AppMessages.APP_ERROR_CODE,
      AppMessages.INTERNAL_SERVER_ERROR
    );
    return res.status(HttpCodes.INTERNAL_SERVER_ERROR).send(errorResponse);
  }
};

exports.updateUser = async (req, res) => {
  var httpRequest = adapterRequest(req);

  try {
    var { body } = httpRequest;
    var exists = await userService.getUserByID(body.id);
    if (!exists) {
      var response = composeResponse.genericError(
        AppMessages.APP_ERROR,
        AppMessages.APP_ERROR_CODE,
        AppMessages.APP_RESOURCE_NOT_FOUND
      );
      return res.status(HttpCodes.BAD_REQUEST).send(response);
    }

    var result = await userService.updateUser(body);
    //Api Call and Compose Response Response
    var response = composeResponse.genericSuccess(
      AppMessages.SUCCESS,
      AppMessages.RECORD_SUCCESSFULY_UPDATED,
      body
    );
    return res.status(HttpCodes.OK).send(response);
  } catch (error) {
    //Compose Error Response
    var errorResponse = composeResponse.genericError(
      AppMessages.ERROR,
      AppMessages.APP_ERROR_CODE,
      AppMessages.INTERNAL_SERVER_ERROR
    );
    return res.status(HttpCodes.INTERNAL_SERVER_ERROR).send(errorResponse);
  }
};

exports.resendOTP = async (req, res) => {
  var httpRequest = adapterRequest(req);

  try {
    var { body } = httpRequest;
    body.otp = await authHelper.generateOTP();
    var result = await userService.updateOTP(body);

    if (!result[0][0].affected_rows || result[0][0].affected_rows === 0) {
      var response = composeResponse.success(
        httpRequest,
        0,
        appMessages.ERROR_PIN_GENERATION,
        body,
        HttpCodes.BAD_REQUEST
      );
      return res.status(HttpCodes.CREATED).send(response);
    }

    //Api Call and Compose Response Response
    var response = composeResponse.success(
      httpRequest,
      1,
      appMessages.PIN_SUCCESSFULY_GENERATED,
      body,
      HttpCodes.OK
    );
    return res.status(HttpCodes.CREATED).send(response);
  } catch (error) {
    //Compose Error Response
    var errorResponse = composeResponse.genericError(
      AppMessages.ERROR,
      AppMessages.APP_ERROR_CODE,
      AppMessages.INTERNAL_SERVER_ERROR
    );
    return res.status(HttpCodes.INTERNAL_SERVER_ERROR).send(errorResponse);
  }
};

exports.confirmOTP = async (req, res) => {
  var httpRequest = adapterRequest(req);

  try {
    var { body } = httpRequest;
    var result = await userService.confirmOTP(body);

    if (!result[0][0].affected_rows || result[0][0].affected_rows === 0) {
      var response = composeResponse.success(
        httpRequest,
        0,
        appMessages.ERROR_INVALID_PIN,
        body,
        HttpCodes.BAD_REQUEST
      );
      return res.status(HttpCodes.CREATED).send(response);
    }

    //Api Call and Compose Response Response
    var response = composeResponse.success(
      httpRequest,
      1,
      appMessages.PIN_SUCCESSFULY_CONFIRMED,
      body,
      HttpCodes.OK
    );
    return res.status(HttpCodes.CREATED).send(response);
  } catch (error) {
    //Compose Error Response
    //Compose Error Response
    var errorResponse = composeResponse.genericError(
      AppMessages.ERROR,
      AppMessages.APP_ERROR_CODE,
      AppMessages.INTERNAL_SERVER_ERROR
    );
    return res.status(HttpCodes.INTERNAL_SERVER_ERROR).send(errorResponse);
  }
};
