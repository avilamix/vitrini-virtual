FROM mcr.microsoft.com/devcontainers/javascript-node:0-18

# Instala pacotes extras se necessário
RUN apt-get update \
  && apt-get install -y --no-install-recommends git curl ca-certificates \
  && rm -rf /var/lib/apt/lists/*
