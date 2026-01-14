FROM python:3.9-slim

# Install additional languages
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    g++ \
    default-jdk \
    nodejs \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user
RUN useradd -m -u 1000 -s /bin/bash codeuser

WORKDIR /home/codeuser

# Restrict permissions
RUN chmod 700 /home/codeuser

USER codeuser

CMD ["python3"]
