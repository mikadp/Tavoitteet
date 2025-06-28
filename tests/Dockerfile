# Use the official Python image as the base image
FROM python:alpine

# Set the working directory in the container
WORKDIR /usr/src/app

COPY . .

# Install system dependencies
RUN apk add  --no-cache \
    curl \
    git \
    unzip \
    wget \
    gnupg \
    && apk add --no-cache --virtual .build-deps gcc musl-dev libffi-dev openssl-dev

    # Install Robot Framework and necessary libraries
RUN pip install --no-cache-dir \
    robotframework \
    robotframework-seleniumlibrary \
    robotframework-requests \
    robotframework-jsonlibrary \
    selenium

# Install Chrome
RUN apk add --no-cache \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    && apk add --no-cache --virtual .chrome-deps \
    alsa-lib \
    xvfb \
    && apk add --no-cache \
    chromium \
    chromium-chromedriver


# Expose a volume for test files
VOLUME ["/app/tests"]

# Set the default command to run Robot Framework tests
CMD ["robot", "--outputdir", "/usr/src/app/results", "/usr/src/app/tests"]