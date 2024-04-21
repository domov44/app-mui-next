const express = require('express');
const auth = require('../controllers/auth');
const middleware = require('../middleware');

const router = express.Router();

// Route pour récupérer un utilisateur
router.get('/checkauth', middleware.jwtMiddleware, auth.checkauth);

// Route pour se connecter un utilisateur
router.post('/login', middleware.spamMiddleware, middleware.ipBlacklistMiddleware, auth.login);

// Route pour déconnecter un utilisateur
router.get('/user/logout', auth.logout);

// Route pour créer un utilisateur
router.post('/register', middleware.spamMiddleware, auth.register);

router.post('/user/reset-password', auth.requestPasswordReset);

// Route pour la réinitialisation du mot de passe
router.post('/user/reset-password/:token', auth.resetPassword);

// Route pour valider le token de réinitialisation
router.get('/user/validate-reset-token/:token', auth.validateResetToken);

module.exports = router;