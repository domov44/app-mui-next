const fs = require('fs');
const path = require('path');
const blacklistPath = path.join(__dirname, '../blacklist.json');

exports.addIpToBlacklist = async (req, res) => {
    const newIp = req.body.ip;
    const raison = req.body.raison || "aucune précision"; // Utiliser la raison du formulaire ou "aucune précision" par défaut

    fs.promises.readFile(blacklistPath, 'utf-8')
        .then(data => {
            let blacklist;

            try {
                blacklist = JSON.parse(data);
            } catch (parseError) {
                console.error('Erreur lors de l\'analyse de la liste noire :', parseError);
                blacklist = [];
            }

            // Vérifier si l'adresse IP existe déjà dans la liste noire
            if (!blacklist.some(entry => entry.ip === newIp)) {
                // Ajoutez l'adresse IP à la liste noire avec timestamp et la raison du formulaire
                const newEntry = {
                    timestamp: new Date().toISOString(),
                    ip: newIp,
                    raison: raison
                };

                blacklist.push(newEntry);

                // Enregistrez la liste noire mise à jour dans le fichier JSON
                fs.promises.writeFile(blacklistPath, JSON.stringify(blacklist, null, 2), 'utf-8')
                    .then(() => {
                        res.json({ success: true, message: 'Adresse IP ajoutée avec succès à la liste noire.' });
                    })
                    .catch(error => {
                        console.error('Erreur lors de l\'écriture dans la liste noire :', error);
                        res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
                    });
            } else {
                res.status(400).json({ success: false, error: 'Cette adresse IP est déjà dans la liste noire.' });
            }
        })
        .catch(error => {
            console.error('Erreur lors de la lecture de la liste noire :', error);
            res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
        });
};

exports.GetBlacklist = async (req, res) => {
    try {
        const logs = fs.readFileSync(blacklistPath, 'utf-8');
        const logsArray = JSON.parse(logs);
        res.json(logsArray);
    } catch (error) {
        console.error('Erreur lors de la lecture du fichier de logs de la liste noire :', error);
        res.status(500).json({ error: 'Erreur interne du serveur', details: error.message });
    }
};

exports.deleteIpToBlacklist = async (req, res) => {
    try {
        const ipToDelete = req.params.ip;
        const blacklistData = fs.readFileSync(blacklistPath, 'utf-8');
        const blacklist = JSON.parse(blacklistData);
        const updatedBlacklist = blacklist.filter(entry => entry.ip !== ipToDelete);
        fs.writeFileSync(blacklistPath, JSON.stringify(updatedBlacklist, null, 2), 'utf-8');
        res.json({ success: true });
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'adresse IP de la liste noire :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};

