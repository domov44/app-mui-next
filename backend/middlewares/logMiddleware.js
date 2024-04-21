const fs = require('fs').promises;
const fsPromises = require('fs').promises;
const path = require('path');
const logFilePath = path.join(__dirname, '../log.json');

// créer un fichier json
async function ensureLogFile() {
    try {
      await fsPromises.access(logFilePath, fs.constants.F_OK);
    } catch (err) {
      await fsPromises.writeFile(logFilePath, '[]', 'utf-8');
    }
  }
  ensureLogFile();
  
  // écrire dans le json
  async function logMiddleware(req, res, next) {
      let requeteType;
      if (req.url === "/login") {
        requeteType = "Connexion";
      } else if (req.url === "/user/logout") {
        requeteType = "Déconnexion";
      } else if (req.url === "/user/create") {
        requeteType = "Création d'un compte";
      } else if (req.url.startsWith("/user/update/")) {
        requeteType = "Mise à jour d'un compte";
      } else if (req.url.startsWith("/user/delete/")) {
        requeteType = "Suppression d'un compte";
      } else if (req.url === "/user/updateCurrentUser") {
        requeteType = "Modification d'un compte perso";
      }
      else {
        requeteType = "autre";
      }
    
      const logMessage = {
        timestamp: new Date().toISOString(),
        url: req.url,
        ip: req.ip,
        requete: requeteType,
      };
    
      console.log('Log Message:', logMessage);
    
      try {
        await ensureLogFile();
        const existingLogs = await fsPromises.readFile(logFilePath, 'utf-8');
        const logsArray = existingLogs ? JSON.parse(existingLogs) : [];
    
        logMessage.status = res.locals.success === true ? 'Réussie' : 'Échouée';
    
        logsArray.push(logMessage);
        logsArray.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
        logsArray.forEach(log => {
          log.formattedTimestamp = new Intl.DateTimeFormat('fr-FR', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            timeZoneName: 'short'
          }).format(new Date(log.timestamp));
        });
    
        await fsPromises.writeFile(logFilePath, JSON.stringify(logsArray, null, 2), 'utf-8');
        console.log('Log written successfully.');
      } catch (error) {
        console.error('Error writing to log file:', error);
      }
      next();
    }

module.exports = logMiddleware;
