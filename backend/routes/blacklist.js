const express = require('express');
const router = express.Router();
const blacklist = require('../controllers/blacklist');
const middleware = require('../middleware'); // N'oubliez pas d'importer vos middlewares si nécessaire

// Endpoint pour ajouter une ip à la liste de blacklistage
router.post('/addBlacklistIp', middleware.jwtMiddleware, middleware.adminMiddleware, blacklist.addIpToBlacklist);

// Endpoint pour ajouter une ip à la liste de blacklistage
router.get('/blacklist', middleware.jwtMiddleware, middleware.adminMiddleware, blacklist.GetBlacklist);

// Endpoint pour supprimer une ip à la liste de blacklistage
router.delete('/blacklist/:ip', middleware.jwtMiddleware, middleware.adminMiddleware, blacklist.deleteIpToBlacklist);

module.exports = router;
