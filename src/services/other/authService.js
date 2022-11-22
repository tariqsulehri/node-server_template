const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.encryptString = async (sourceString) => {
    const salt = await bcrypt.genSalt(10);
    var encryptedString = await bcrypt.hash(sourceString, salt);
    return encryptedString
}

exports.generateOTP = async () => {
    const otp = Math.floor(1000 + Math.random() * 9000);
    return otp
}

exports.generateAuthToken = async (baseField) => {
    const token = jwt.sign({ _id: baseField }, 'node_secureJwtKey');  //process.env.NODE_SECRET_KEY)//'node_secureJwtKey') // config.get('jwtPrivateKey'));
    return token;
}

// exports.generateAndAddAuthTokenInResponseHeader = async (baseFiled, resObject) => {
//     let token = await generateAuthToken(baseFiled);
//     resObject.header('x-auth-token', token);
//     return resObject;
// }

exports.generateAndAddAuthTokenInResponseHeader = async (baseFiled) => {
    let token = await this.generateAuthToken(baseFiled);
    return token;
}

exports.isValidUser = async (requestPassword, encryptedPassword) => {
    let isValidPassword = await bcrypt.compare(requestPassword, encryptedPassword);
    return isValidPassword;
}

exports.smsOTP = async () => {

}