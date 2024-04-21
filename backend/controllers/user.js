const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const cookie = require('cookie');
const middleware = require('../middleware');
const User = require('../models/user');
const Role = require('../models/role');
const { containsShockingWords } = require ('../functions/ShocksWordsFilter')

exports.getUserData = async (req, res) => {
    try {
        const userId = req.userId;
        const userData = await User.findOne({
            attributes: ['name', 'pseudo', 'ddn', 'description', 'creation_date', 'surname', 'email', 'picture', 'role_id'],
            include: [{ model: Role, attributes: ['label'] }],
            where: { id: userId }
        });

        if (!userData) {
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        }

        res.json(userData);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erreur lors de la récupération des données de l'utilisateur", details: error.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const userData = await User.findOne({
            attributes: ['name', 'surname', 'email', 'picture'],
            include: [{ model: Role, attributes: ['label'] }],
            where: { id: userId }
        });

        if (!userData) {
            return res.status(404).json({ error: "Utilisateur spécifique non trouvé" });
        }

        res.json(userData);
    } catch (error) {
        return res.status(500).json({ error: "Erreur lors de la récupération des données de l'utilisateur spécifique" });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'name', 'pseudo', 'surname', 'email', 'picture', 'role_id'],
            include: [{ model: Role, attributes: ['label'] }]
        });

        return res.json(users);
    } catch (error) {
        return res.status(500).json("Erreur du serveur");
    }
};

exports.createUser = async (req, res) => {
    try {
        const emailExists = await User.findOne({
            where: { email: req.body.email }
        });

        if (emailExists) {
            res.locals.success = false;
            return res.status(409).json('Cet email est déjà associé à un compte');
        } else {
            res.locals.success = true;
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        let imageFullPath = '';

        if (req.files && req.files.image) {
            const image = req.files.image;
            const extname = path.extname(image.name);
            const uniqueFilename =
                image.name + '_' + Date.now() + '_' + Math.floor(Math.random() * 1000) + extname;
            const uploadPath = path.join(__dirname, '../public/images/user', uniqueFilename);

            image.mv(uploadPath, (err) => {
                if (err) {
                    console.error('Erreur lors de l\'enregistrement du fichier :', err);
                    res.locals.success = false;
                    return res.status(500).json('Erreur lors de l\'enregistrement du fichier');
                }

                console.log('Fichier enregistré avec succès :', uploadPath);
            });

            imageFullPath = `http://localhost:8081/images/user/${uniqueFilename}`;
        } else {
            imageFullPath = 'https://www.club.reltim.com/wp-content/uploads/2023/01/engineer-1.png';
        }

        const newUser = await User.create({
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            password: hashedPassword,
            picture: imageFullPath,
            role_id: req.body.role_id
        });

        // Vérification des mots haineux dans le nom, la description et les étapes
        if (containsShockingWords(name) || containsShockingWords(surname)) {
            return res.status(400).json({ error: 'La recette contient des mots inappropriés.' });
        }

        res.locals.success = true;
        res.json(newUser);

    } catch (error) {
        console.error(error);
        res.locals.success = false;
        res.status(500).json('Erreur lors de la création de l\'utilisateur');
    }

    middleware.logMiddleware(req, res, () => { });
};


exports.updateUser = async (req, res) => {
    try {
        const id = req.params.id;

        const values = {
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            role_id: req.body.role_id,
            // Si un nouveau mot de passe est bien fourni, ajoutez la valeur hachée, sinon ignorez le champ
            ...(req.body.password ? { password: await bcrypt.hash(req.body.password, 10) } : {})
        };

        const updatedUser = await User.update(values, {
            where: { id: id },
            returning: true, // Pour obtenir l'enregistrement mis à jour
            plain: true // Pour obtenir l'objet plutôt que le tableau affecté
        });

        res.locals.success = true;
        res.json(updatedUser[1]); // Utilisez l'objet mis à jour dans la réponse

    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            res.locals.success = false;
            res.status(409).json("L'email est déjà pris");
        } else {
            res.locals.success = false;
            res.status(500).json("Erreur lors de la mise à jour en base de données");
        }
    }
    middleware.logMiddleware(req, res, () => { });
};

exports.updateCurrentUser = async (req, res) => {
    try {
        const userId = req.userId;

        const values = {
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            ddn: req.body.ddn,
            description: req.body.description,
            linkedin: req.body.linkedin,
            site_web: req.body.site_web,
            // Si un nouveau mot de passe est fourni, ajouter la valeur hachée, sinon ignorer le champ
            ...(req.body.password ? { password: await bcrypt.hash(req.body.password, 10) } : {})
        };

        // Vérification des mots haineux dans le nom, la description et les étapes
        if (containsShockingWords(nom) || containsShockingWords(description)) {
            return res.status(400).json({ error: 'La recette contient des mots inappropriés.' });
        }

        const updatedUser = await User.update(values, {
            where: { id: userId },
            returning: true,
            plain: true
        });

        res.locals.success = true;
        res.json(updatedUser[1]);

    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            res.locals.success = false;
            res.status(409).json("L'email est déjà pris");
        } else {
            res.locals.success = false;
            res.status(500).json("Erreur lors de la mise à jour en base de données");
        }
    }
    middleware.logMiddleware(req, res, () => { });
};

exports.deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedUser = await User.destroy({ where: { id: id } });

        if (deletedUser === 0) {
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        }

        res.locals.success = true;
        res.json({ success: true });

    } catch (error) {
        res.locals.success = false;
        res.status(500).json("Erreur du serveur");
    }
    middleware.logMiddleware(req, res, () => { });
};


exports.getUserBySlug = async (req, res) => {
    try {
        const username = req.params.username;

        const user = await User.findOne({
            where: { pseudo: username },
            attributes: ['id', 'name', 'pseudo', 'surname', 'email', 'picture', 'description'],
            include: [{ model: Role, attributes: ['label'] }]
        });

        if (!user) {
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la récupération de l'utilisateur'", details: error.message });
    }
};
