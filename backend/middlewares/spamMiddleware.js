// Middleware anti-spam selon IP
const requestsByIp = {};

const spamMiddleware = (req, res, next) => {
    if (!(req.ip in requestsByIp)) {
        next();
    } else {
        if (Date.now() - requestsByIp[req.ip] < 2000) {
            res.status(429).json({ redirectTo: '/erreur-429' });
        } else {
            next();
        }
    }
    requestsByIp[req.ip] = Date.now();
};


module.exports = spamMiddleware;
