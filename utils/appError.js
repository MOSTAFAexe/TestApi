class AppError extends Error{
    constructor(){
        super();
    }

    create(message, statusCode, statustxt){
        this.message = message;
        this.statusCode = statusCode;
        this.statustxt = statustxt;
        // return this;
    }
}

module.exports = new AppError();