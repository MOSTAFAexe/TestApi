module.exports = (asyncfn) => {
    return (req, res, next) => {
        
        asyncfn(req, res, next).catch((err) => {
            next(err);
            // return res.json({status: statustxt.ERROR, data: null, msg: {error: err}});
        });
    }
};