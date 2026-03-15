#!/bin/bash

# Script de configuración inicial para EC2
# Ejecutar como: ./setup-ec2.sh

set -e  # Salir si hay error

echo "=== Actualizando sistema ==="
sudo apt-get update
sudo apt-get upgrade -y

echo "=== Instalando Docker ==="
sudo apt-get install -y docker.io docker-compose-plugin

echo "=== Agregando usuario a grupo docker ==="
sudo usermod -aG docker $USER

echo "=== Creando directorio de la aplicación ==="
mkdir -p ~/app
cd ~/app

echo "=== Creando directorios para SSL (opcional) ==="
mkdir -p ssl

echo "=== Docker instalado correctamente ==="
docker --version
docker compose version

echo ""
echo "SIGUIENTE PASO:"
echo "==============="
echo "1. Agregar estos SECRETS en GitHub Actions settings:"
echo "   - DOCKERHUB_USERNAME"
echo "   - DOCKERHUB_TOKEN"
echo "   - EC2_FRONTEND_HOST (IP pública de EC2)"
echo "   - EC2_USER (ubuntu por defecto)"
echo "   - EC2_SSH_KEY (private key)"
echo ""
echo "2. Copiar el .env.production correctamente con la URL del backend"
echo ""
echo "3. Hacer push a rama 'main' para disparar el workflow"
