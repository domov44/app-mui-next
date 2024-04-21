const express = require('express');
const router = express.Router();
const log = require('../controllers/log');
const middleware = require('../middleware'); // N'oubliez pas d'importer vos middlewares si nécessaire

// Endpoint pour récupérer les logs
router.get('/logs', middleware.jwtMiddleware, middleware.adminMiddleware, log.getLogs);

// Endpoint pour supprimer un log
router.delete('/logs/:timestamp', middleware.jwtMiddleware, middleware.adminMiddleware, log.deleteLog);

module.exports = router;
