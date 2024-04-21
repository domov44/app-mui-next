# Utiliser une image Node.js
FROM node:20.10

# Définir le répertoire de travail dans l'image
WORKDIR /app

# Copier le fichier package.json et package-lock.json (si présent)
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers de l'application
COPY . .

# Exposer le port sur lequel le backend écoute
EXPOSE 8081

# Commande pour démarrer l'application
CMD ["npm", "start"]
