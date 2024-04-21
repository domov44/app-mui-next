// Middleware pour l'administrateur
const moderatorMiddleware = (req, res, next) => {
    if (req.userRole === 1 || req.userRole === 4) {
        next();
    } else {
        res.status(403).json({ error: 'Accès interdit. Vous n\'avez pas les permissions nécessaires.' });
    }
};
module.exports = moderatorMiddleware;
