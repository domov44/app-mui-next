const express = require('express');
const user = require('../controllers/user');
const middleware = require('../middleware');

const router = express.Router();

// Route pour récupérer un utilisateur
router.get('/user/getUserData', middleware.jwtMiddleware, middleware.ipBlacklistMiddleware, user.getUserData);

// Route pour récupérer un utilisateur par ID
router.get('/user/getForeachUserData/:id', middleware.jwtMiddleware, middleware.adminMiddleware, user.getUserById);

// Route pour récupérer les utilisateurs
router.get('/user', middleware.jwtMiddleware, middleware.adminMiddleware, middleware.ipBlacklistMiddleware, user.getUsers);

// Route pour créer un utilisateur
router.post('/user/create', middleware.jwtMiddleware, middleware.adminMiddleware, user.createUser);

// Route pour mettre à jour un utilisateur
router.put('/user/update/:id', middleware.jwtMiddleware, middleware.adminMiddleware, user.updateUser);

// Route pour mettre à jour son profil côté utilisateur
router.put('/user/updateCurrentUser', middleware.jwtMiddleware, middleware.ipBlacklistMiddleware, user.updateCurrentUser);

// Route pour supprimer un utilisateur
router.delete('/user/delete/:id', middleware.jwtMiddleware, middleware.adminMiddleware, user.deleteUser);

// Route pour afficher la page user
router.get('/user/public/:username', middleware.ipBlacklistMiddleware, user.getUserBySlug);

module.exports = router;