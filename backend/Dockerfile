# Vaihe 1: Rakennusvaihe
FROM golang:1.23.4 AS backend-builder

WORKDIR /app

COPY . .

# Asenna riippuvuudet ja rakenna binaari
RUN go mod tidy
RUN go build -o backend .

# Vaihe 2: Suoritusvaihe
FROM ubuntu:22.04

WORKDIR /app

# Kopioi binaari rakennusvaiheesta suoritusvaiheeseen
COPY --from=backend-builder /app/backend . 

RUN ls -l /app 
# Debug: Tarkista, että binaari on kopioitu oikein

EXPOSE 8080
CMD ["./backend"]
