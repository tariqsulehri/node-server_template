const HttpCodes = require("../constants/httpCodes");
const AppMessages = require("../constants/appMessages");
const composeResponse =  require("../helpers/componseResponse");

function admin(req, res, next) {

   if(!req.user.role){
      var errorResponse = composeResponse.genericError(
         AppMessages.ERROR,
         AppMessages.APP_ERROR_CODE,
         AppMessages.APP_ACCESS_DENIED
      );
  
      return res.status(HttpCodes.FORBIDDEN).send(errorResponse);
   }

     if(req.user.role !== 'admin' ){
        var errorResponse = composeResponse.genericError(
           AppMessages.ERROR,
           AppMessages.APP_ERROR_CODE,
           AppMessages.APP_ACCESS_DENIED
        );
    
        return res.status(HttpCodes.FORBIDDEN).send(errorResponse);
     }

     next();

}


module.exports = admin;

