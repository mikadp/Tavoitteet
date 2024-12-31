# Vaihe 1: Rakennusvaihe
FROM node:18 AS builder

WORKDIR /app
COPY package*.json ./
COPY . .

RUN npm install
RUN npm run build

# Vaihe 2: Suoritusvaihe
FROM nginx:alpine

COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]