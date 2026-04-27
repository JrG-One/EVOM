FROM python:3.9-slim

# Create a non-root user 'runner'
RUN useradd -m -r runner

WORKDIR /app

# Copy and install requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY . .

# Ensure the runner user owns the app directory
RUN chown -R runner:runner /app

# Switch to non-root user
USER runner

# Run with Gunicorn using Uvicorn workers for concurrency
CMD ["gunicorn", "app.main:app", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "-b", "0.0.0.0:5000"]
