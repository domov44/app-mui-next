const fs = require('fs');
const path = require('path');
const blacklistPath = path.join(__dirname, '../blacklist.json');

// Middleware pour bloquer les adresses IP
const ipBlacklistMiddleware = (req, res, next) => {
    if (req.path === '/addBlacklistIp' && req.method === 'POST') {
        // Si la requête est pour ajouter une IP, passer à la nouvelle route
        next();
    } else {
        fs.promises.readFile(blacklistPath, 'utf-8')
            .then(data => {
                let blacklist;

                try {
                    blacklist = JSON.parse(data);
                } catch (parseError) {
                    console.error('Erreur lors de l\'analyse de la liste noire :', parseError);
                    blacklist = [];
                }

                const clientIp = req.ip;
                const isBlacklisted = blacklist.some(entry => entry.ip === clientIp);

                if (isBlacklisted) {
                    // Adresse IP bloquée
                    return res.status(403).json({ error: 'Accès interdit depuis cette adresse IP.' });
                } else {
                    // Adresse IP non bloquée, continuer
                    next();
                }
            })
            .catch(err => {
                if (err.code === 'ENOENT') {
                    // Le fichier n'existe pas, on le crée
                    console.log('Création du fichier blacklist.json avec une liste noire vide.');
                    fs.promises.writeFile(blacklistPath, '[]', 'utf-8')
                        .then(() => next()) // Continuer la requête après la création du fichier
                        .catch(writeError => {
                            console.error('Erreur lors de la création du fichier blacklist.json :', writeError);
                            return res.status(500).json({ error: 'Erreur interne du serveur' });
                        });
                } else {
                    console.error('Erreur lors de la lecture de la liste noire :', err);
                    return res.status(500).json({ error: 'Erreur interne du serveur' });
                }
            });
    }
};

module.exports = ipBlacklistMiddleware;
