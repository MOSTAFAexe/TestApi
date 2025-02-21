const appError = require("../utils/appError");
const statustxt = require("../utils/statustxt");

module.exports = (...roles) => {
    
    return (req, res, next) =>{
        if(!roles.includes(req.currentUser.role)){
            appError.create("this role is not authorized", 401, statustxt.FAIL)
            return next(appError);
        }
        next();
    }
}