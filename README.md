# 🚀 EVOM: EnterVue of Minds

> **A peek inside thinking pattern and problem solving**

*“Enter vue” is a wordplay on Interview, meaning to "enter view" or "take a peek inside" certain thought processes.*

EVOM is a state-of-the-art platform designed to revolutionize how candidates prepare for interviews. Combining AI-driven mock interviews, real-time code execution, and ATS-friendly resume analysis, EVOM provides a comprehensive toolkit for success.

---

## ✨ Features

- **🤖 AI Mock Interviews**: Realistic voice and chat-based interviews tailored to your role and experience.
- **⚡ Real-Time Code Engine**: Execute code securely in a sandboxed environment supporting Python, JavaScript, and more.
- **📄 Smart Resume Analyzer**: Get detailed feedback and ATS scores to perfect your resume.
- **📊 Performance Analytics**: Track your progress with detailed insights and feedback after every session.
- **🔐 Secure & Scalable**: Built with modern security practices and a scalable microservices architecture.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React (Vite)
- **Styling**: TailwindCSS, Shadcn/UI
- **State Management**: Zustand
- **Languages**: JavaScript/TypeScript

### Backend
- **Runtime**: Node.js & Express
- **Database**: PostgreSQL (Prisma ORM)
- **Services**: Microservices architecture for code execution.

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Orchestration**: Docker Compose for local dev.

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
- **Node.js** (v18+)
- **Docker** & **Docker Compose**
- **Python 3.9+** (For local microservice dev)

### 1. Database Setup
Start the PostgreSQL database using Docker Compose:
```bash
docker-compose up -d
```
This will start PostgreSQL on port `5434` and PgAdmin on port `5050`.

### 2. Backend Setup
Navigate to the `Backend` directory and install dependencies:
```bash
cd Backend
npm install
```
Set up your `.env` file (see [Environment Variables](#-environment-variables) below).
Run database migrations:
```bash
npx prisma migrate dev
```
Start the server:
```bash
npm start
```
*Server runs on port `5001` by default.*

### 3. Frontend Setup
Navigate to the `Frontend` directory:
```bash
cd Frontend
npm install
npm run dev
```
*Frontend usually runs on `http://localhost:5173`.*

### 4. Microservices (Code Runner)
Navigate to `Microservices/code_runner`:
```bash
cd Microservices/code_runner
chmod +x setup_env.sh
./setup_env.sh
```
Run the service:
```bash
docker run -p 5002:5000 -v /var/run/docker.sock:/var/run/docker.sock code-runner-service
```

---

## 🔑 Environment Variables

Create a `.env` file in the `Backend` directory with the following keys:

```ini
PORT=5001
DATABASE_URL="postgresql://postgres:mysecretpassword@localhost:5434/interviewwhiz?schema=public"
JWT_SECRET="your_jwt_secret"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# OpenAI / Azure OpenAI
OPENAI_API_KEY="your_openai_key"
OPENAI_API_URL="your_openai_endpoint"

# Email Service
EMAIL_SERVICE="gmail"
EMAIL_USER="your_email"
EMAIL_PASS="your_app_password"

# Code Runner Service
CODE_RUNNER_URL="http://localhost:5002"
SERVICE_SECRET="default_secret_change_me"
```

---

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

---

*Built with ❤️ by the InterviewWhiz Team*
