FROM jenkins/jenkins:lts
USER root

# Install Chromium and necessary libraries for Headless Chrome
RUN apt-get update && apt-get install -y \
    chromium \
    libnss3 \
    libatk-bridge2.0-0 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Set the CHROME_BIN environment variable so Karma can find it
ENV CHROME_BIN=/usr/bin/chromium

USER jenkins