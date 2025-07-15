# Use the official Python image as the base image
FROM python:alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Install system dependencies
RUN apk add --no-cache \
    curl \
    git \
    unzip \
    wget \
    gnupg \
    && apk add --no-cache --virtual .build-deps gcc musl-dev libffi-dev openssl-dev

# Install Robot Framework and necessary libraries
RUN pip install --upgrade pip && \
    pip install --no-cache-dir \
        robotframework \
        robotframework-seleniumlibrary \
        robotframework-requests \
        robotframework-jsonlibrary \
        selenium

# Install Chrome and dependencies
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

# Download and install ChromeDriver to a fixed location
RUN CHROME_DRIVER_VERSION=$(curl -s https://chromedriver.storage.googleapis.com/LATEST_RELEASE) && \
    mkdir -p /usr/local/bin/chromedriver && \
    wget -O /tmp/chromedriver.zip https://chromedriver.storage.googleapis.com/$CHROME_DRIVER_VERSION/chromedriver_linux64.zip && \
    unzip /tmp/chromedriver.zip -d /usr/local/bin/chromedriver && \
    chmod +x /usr/local/bin/chromedriver/chromedriver && \
    rm /tmp/chromedriver.zip

# Create necessary directories
RUN mkdir -p /usr/src/app/tests && \
    mkdir -p /usr/src/app/results && \
    mkdir -p /usr/src/app/resources

# Set environment variables for ChromeDriver and Chrome
ENV SELENIUM_WEBDRIVER_CHROMEDRIVER_PATH=/usr/local/bin/chromedriver/chromedriver
ENV CHROME_BIN=/usr/bin/chromium-browser

# Expose a volume for test files
VOLUME ["/app/tests"]

# Set the default command to run Robot Framework tests
CMD ["robot", "--outputdir", "/usr/src/app/results", "/usr/src/app/tests"]