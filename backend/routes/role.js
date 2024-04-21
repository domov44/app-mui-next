const express = require('express');
const router = express.Router();
const role = require('../controllers/role');
const middleware = require('../middleware');

// endpoint pour récupérer les roles disponibles
router.get('/roles', middleware.jwtMiddleware, middleware.adminMiddleware, role.getRole);

module.exports = router;