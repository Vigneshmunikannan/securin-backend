const { constants } = require('../constants')

const errorHandler = (err, req, res, next) => {
    const statuscode = res.statusCode ? res.statusCode : 500;
    switch (statuscode) {
        case constants.VALIDATION_ERROR:
            res.json({ title: "Validation failed", message: err.message, stackTrace: err.stack });
            console.log('im 400')
            break;
        case constants.NOT_FOUND:
            res.json({ title: "Not Found", message: err.message, stackTrace: err.stack });
            break;
        case constants.UNAUTHORIZED:
            res.json({  message: err.message, stackTrace: err.stack });
            break;
        case constants.FORBIDDEN:
            res.json({ message: err.message, stackTrace: err.stack });
            break;
        case constants.SERVER_ERROR:
            res.json({ message: err.message, stackTrace: err.stack });
            break;
        case constants.alreadyuserpresent:
            res.json({ message: err.message, stackTrace: err.stack });
            break;
        case constants.nomodification:
            console.log("no modification")
            res.json({message: err.message, stackTrace: err.stack})
            break;
        default:
            res.json({ title: "undefined error in middleware", message: err.message, stackTrace: err.stack });
            break;
    }
}
module.exports = errorHandler;
