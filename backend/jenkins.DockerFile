FROM jenkins/jenkins:lts
USER root

# Install Chromium only for Angular Unit Tests (Karma)
RUN apt-get update && apt-get install -y \
    chromium \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Set the CHROME_BIN environment variable for Karma
ENV CHROME_BIN=/usr/bin/chromium

USER jenkins