# Vaihe 1: Rakennusvaihe
FROM node:18 AS frontend-builder

WORKDIR /app
COPY package*.json ./
COPY . .

RUN npm install
RUN npm run build

# Vaihe 2: Suoritusvaihe
FROM nginx:alpine

COPY --from=frontend-builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]