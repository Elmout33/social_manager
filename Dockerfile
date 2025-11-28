# Étape 1 : Construction de l'application (Build)
FROM node:20-alpine as builder

WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./
# Si vous n'avez pas de package-lock.json, supprimez-le de la ligne ci-dessus

# Installation des dépendances
RUN npm install

# Copie du code source
COPY . .

# Construction pour la production (génère le dossier /dist)
RUN npm run build

# Étape 2 : Serveur Web (Nginx) pour servir les fichiers statiques
FROM nginx:alpine

# Copie de la configuration Nginx (voir fichier ci-dessous)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copie des fichiers construits depuis l'étape 1 vers le dossier de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Exposition du port 80
EXPOSE 80

# Démarrage de Nginx
CMD ["nginx", "-g", "daemon off;"]
