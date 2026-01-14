#!/bin/bash

# Build the sandbox image
echo "Building Sandbox Image..."
docker build -t code-runner-sandbox ./sandbox

# Build the Service image
echo "Building Code Runner Service Image..."
docker build -t code-runner-service .

echo "Setup Complete. Run 'docker run -p 5000:5000 -v /var/run/docker.sock:/var/run/docker.sock code-runner-service' to start the server."
