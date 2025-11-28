# Étape 1 : Construction
FROM node:20-alpine as builder
WORKDIR /app
# Copie flexible pour éviter l'erreur si package-lock.json manque
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Étape 2 : Serveur Web
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
