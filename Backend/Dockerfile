FROM node:alpine3.21

# Install required dependencies for node-canvas, python, and prisma
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev \
    pixman-dev \
    openssl

ENV PYTHON=python3
ENV NODE_ENV=production

WORKDIR /app

# Ensure we copy package.json and package-lock.json first for better cache utilization
COPY package.json package-lock.json ./

# Install dependencies using npm ci for production reliability
RUN npm ci --include=dev

# Copy the rest of the application
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Ensure proper permissions for the node user
RUN chown -R node:node /app

# Switch to non-root user
USER node

EXPOSE 5001

CMD [ "npm", "run", "start" ]
