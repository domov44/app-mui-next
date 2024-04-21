const jwt = require('jsonwebtoken');
const fs = require('fs');
const publicKey = fs.readFileSync('public_key.pem', 'utf8');

// Fonction middleware pour vérifier le token JWT
const jwtMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.json("Un token est nécessaire, veuillez le fournir pour la prochaine fois.");
        } else {
            const publicKey = fs.readFileSync('public_key.pem', 'utf8');

            const decoded = await new Promise((resolve, reject) => {
                jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(decoded);
                    }
                });
            });

            res.locals.success = true;
            req.userId = decoded.id;
            req.userRole = decoded.role;
            next();
        }
    } catch (error) {
        console.error(error);
        res.locals.success = false;
        res.json("Non authentifié");
    }
};

module.exports = jwtMiddleware;
