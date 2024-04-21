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
const { Op } = require('sequelize');
const mailer = require('../utils/mailer');
const { containsShockingWords } = require('../functions/ShocksWordsFilter')

exports.checkauth = async (req, res) => {
    try {
        const response = {
            status: 'Authenticated',
            userRole: req.userRole,
        };
        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la vérification de l'authentification", details: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const rememberMe = req.body.rememberMe;

        const user = await User.findOne({
            attributes: ['id', 'password', 'role_id'],
            include: [{ model: Role, attributes: ['label'] }],
            where: {
                [Op.or]: [
                    { email: username },
                    { pseudo: username }
                ]
            },
        });

        if (!user) {
            res.locals.success = false;
            return res.json({ success: false, message: "Fail", details: "Utilisateur non trouvé" });
        }

        const hashedPassword = user.password;

        const result = await bcrypt.compare(password, hashedPassword);

        if (result) {
            res.locals.success = true;
            const id = user.id;
            const role = user.role_id;
            const privateKey = fs.readFileSync('private_key.pem', 'utf8');
            const token = jwt.sign({ id, role }, privateKey, { algorithm: 'RS256', expiresIn: '7d' });

            const cookieOptions = {
                httpOnly: true,
                domain: 'localhost',
                path: '/',
                maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : null,
                sameSite: 'None',
                secure: true
            };

            res.setHeader('Set-Cookie', cookie.serialize('token', token, cookieOptions));

            const response = { success: true, Login: true, token, userRole: role };
            res.json(response);
        } else {
            res.locals.success = false;
            const response = { success: false, Login: false, message: "Email ou mot de passe incorrect" };
            res.json(response);
        }

        middleware.logMiddleware(req, res, () => { });
    } catch (error) {
        res.locals.success = false;
        return res.status(500).json({ success: false, error: 'Erreur lors de la connexion', details: error.message });
    }
};


exports.register = async (req, res) => {
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

        // Vérification des mots haineux dans les champs du nouvel utilisateur
        if (containsShockingWords(req.body.name) || containsShockingWords(req.body.surname) || containsShockingWords(req.body.pseudo) || containsShockingWords(req.body.email)) {
            return res.status(400).json({ error: 'Le user contient des mots inappropriés.' });
        }

        const newUser = await User.create({
            pseudo: req.body.pseudo,
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            password: hashedPassword,
            role_id: 2,
            picture: imageFullPath,
        });

        res.locals.success = true;
        // Générer le token ici après la création de l'utilisateur
        const id = newUser.id;
        const role = newUser.role_id;
        const privateKey = fs.readFileSync('private_key.pem', 'utf8');
        const token = jwt.sign({ id, role }, privateKey, { algorithm: 'RS256', expiresIn: '7d' });

        const cookieOptions = {
            httpOnly: true,
            domain: 'localhost',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: 'None',
            secure: true
        };
        res.setHeader('Set-Cookie', cookie.serialize('token', token, cookieOptions));
        res.json(newUser);
    } catch (error) {
        console.error(error);
        res.locals.success = false;
        res.status(500).json('Erreur lors de la création de l\'utilisateur');
    }

    middleware.logMiddleware(req, res, () => { });
};

exports.logout = async (req, res) => {
    res.clearCookie('token', { domain: 'localhost', path: '/' });

    res.locals.success = true;
    const response = { Status: "Success" };
    res.json(response);
};

exports.requestPasswordReset = async (req, res) => {
    const { email } = req.body;
    const privateKey = fs.readFileSync('private_key.pem', 'utf8');

    try {
        // Vérifier si l'utilisateur existe
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }

        // Générer un token unique avec JWT valable 15 minutes
        const token = jwt.sign({ userId: user.id }, privateKey, { algorithm: 'RS256', expiresIn: '15m' });

        // Stocker le token et sa date d'expiration en base de données
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 900000; // 15 minutes d'expiration en millisecondes
        await user.save();

        // Envoyer un e-mail à l'utilisateur avec le lien de réinitialisation
        const resetLink = `http://localhost:3000/reinitialiser-mot-de-passe/${token}`;
        await mailer.sendPasswordResetEmail(email, resetLink);

        res.json({ message: "Un e-mail avec des instructions pour réinitialiser votre mot de passe a été envoyé." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Une erreur s'est produite lors de la demande de réinitialisation du mot de passe." });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;

        const publicKey = fs.readFileSync('public_key.pem', 'utf8');
        const decodedToken = jwt.verify(token, publicKey, { algorithms: ['RS256'] });

        const userId = decodedToken.userId;
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }
        if (user.resetPasswordToken !== token) {
            return res.status(400).json({ message: "Le lien de réinitialisation du mot de passe est invalide." });
        }
        if (user.resetPasswordExpires < Date.now()) {
            return res.status(400).json({ message: "Le lien de réinitialisation du mot de passe a expiré." });
        }

        const values = {
            ...(req.body.password ? { password: await bcrypt.hash(req.body.password, 10) } : {})
        };

        const updatedUser = await User.update(values, {
            where: { id: userId },
            returning: true,
            plain: true
        });

        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        res.json({ message: "Mot de passe réinitialisé avec succès." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Une erreur s'est produite lors de la réinitialisation du mot de passe." });
    }
};

exports.validateResetToken = async (req, res) => {
    const { token } = req.params;

    try {
        const publicKey = fs.readFileSync('public_key.pem', 'utf8');

        const decodedToken = jwt.verify(token, publicKey, { algorithms: ['RS256'] });

        const user = await User.findOne({
            where: {
                resetPasswordToken: token,

            }
        });

        if (!user) {
            return res.status(400).json({ message: "Le lien de réinitialisation du mot de passe est invalide ou a expiré." });
        }

        res.status(200).json({ message: "Le lien de réinitialisation du mot de passe est valide." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Une erreur s'est produite lors de la validation du token de réinitialisation." });
    }
};
