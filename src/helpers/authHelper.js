const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.encryptString = async (sourceString) => {
  const salt = await bcrypt.genSalt(10);
  var encryptedString = await bcrypt.hash(sourceString, salt);
  return encryptedString;
};

exports.generateOTP = async () => {
  const otp = Math.floor(1000 + Math.random() * 9000);
  return otp;
};

exports.generateAuthToken = async (baseField) => {
  const token = jwt.sign({ _id: baseField }, "cw_jwtPrivateKey"); //'node_secureJwtKey') // config.get('jwtPrivateKey'));
  return token;
};

exports.generateAuthTokenWithObject = async (data) => {
  const token = jwt.sign(
    {
      _id: data.id,
      role: data.role,
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      display_name: data.display_name,
    },
    "cw_jwtPrivateKey"
  ); //'node_secureJwtKey') // config.get('jwtPrivateKey'));
  return token;
};
exports.addAuthTokenInResponseHeader = async (data, resObject) => {
  token = await this.generateAuthTokenWithObject(data);
  data.token = token;
  resObject.header("x-auth-token", token);
  return resObject;
};

exports.isValidUser = async (
  requestPassword,
  encryptedPassword,
  responseObject
) => {
  let isValidPassword = await bcrypt.compare(
    requestPassword,
    encryptedPassword
  );
  return isValidPassword;
};

exports.smsOTP = async () => {};
