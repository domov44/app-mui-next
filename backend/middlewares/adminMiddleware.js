// Middleware pour l'administrateur
const adminMiddleware = (req, res, next) => {
    if (req.userRole === 1) {
        next();
    } else {
        res.status(403).json({ error: 'Accès interdit. Vous n\'avez pas les permissions nécessaires.' });
    }
};
module.exports = adminMiddleware;
