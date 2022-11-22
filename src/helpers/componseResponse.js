/**
 * @desc    Send any success response      // This Parameter for future use 
 * @param   {object | arrray} httpRequest  // Httprequest Object
 * @param   {number} status                // user defines or external status code
 * @param   {string} message               // message string
 * @param   {object | array} results       // result object
 * @param   {number} httpStatusCode        // HttpCode
 */

exports.success = (httpRequest, status, message, results, httpStatusCode) => {
    return {
        status: status,
        message: message,
        code: httpStatusCode,
        isError: false,
        result: results
    }
}

exports.genericResponse = (status, errNum, errMsg) => {
    return {
        "status": status,
        "errNum": errNum,
        "errMsg": errMsg
    };
};

exports.error = (httpRequest, message, httpStatusCode) => {
    // HTTP request code
    const httpStatusCodes = [200, 201, 400, 401, 404, 403, 422, 500];
    // Get matched code
    const findCode = httpStatusCodes.find((code) => code == httpStatusCode);

    if (!findCode) httpStatusCode = 500;
    else httpStatusCode = findCode;

    return {
        status: -1,
        message: `${httpRequest.method} - ${message}!`,
        code: httpStatusCode,
        isError: true,
        result: null
    };
};


exports.genericError = (error, errorNum, errMessage) => {
    return {
        status: error,
        code: errorNum,
        message: errMessage,
        result: null
    };
};

exports.genericSuccess = (status, message, results) => {
    return {
        status: status,
        message: message,
        result: results
    }
}

exports.validation = (httpRequest, message) => {
    return {
        status: -1,
        message: `${httpRequest.method} - ${message}`,
        isError: true,
        code: 422,
    };
};