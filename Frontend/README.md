# EVOM – Your AI-Powered Mock Interview Platform

EVOM is an intelligent web platform designed to simulate real-life interview scenarios using pre-hosted Large Language Models (LLMs) like OpenAI's ChatGPT. It also offers a resume analysis tool and feedback mechanisms to help users prepare more efficiently and confidently for job interviews.

---

## Project Overview

*EVOM* provides:

- *Interactive mock sessions* powered by AI  
- *Resume analysis* with actionable insights  
- *Performance analytics and scores* to improve skills  
- *User profiles* to track EVOM sessions and progress  
- *Authentication system* with secure login/signup  
- *Dashboard* to manage EVOM history and feedback  

This project is ideal for students, professionals, and job seekers who want to sharpen their skills through realistic, data-driven mock sessions.

## Features

| Feature              | Description                                                                 |
|----------------------|-----------------------------------------------------------------------------|
| AI Mock Sessions     | Interactive question-answer simulation with GPT-based responses             |
| Resume Analyser      | Upload and get feedback on resume formatting, keywords, and structure       |
| Profile Portal       | View personal info, performance scores, and EVOM history               |
| Real-time Scoring    | Analyze fluency, accuracy, clarity, and relevance of your responses         |
| Secure Auth          | Login/signup with JWT-based authentication                                  |
| User Dashboard       | Central hub with personalized performance summaries                         |
| UI Components        | Reusable modular components with Tailwind CSS and Radix UI                  |

## Folder Structure (Frontend)

```
EVOM_Frontend/
├── public/            
├── src/                        # Main source code
│   ├── assets/                 # Static images, logos, etc.
│   ├── components/             # Reusable components
│   │   ├── EVOMPage/
│   │   │   ├── ConservationPanel.jsx
│   │   │   ├── EVOMHeader.jsx
│   │   │   ├── MessageBubble.jsx
│   │   │   ├── ResponsePanel.jsx
│   │   │   └── TypingIndicator.jsx
│   │   ├── profilePage/
│   │   │   ├── EVOMStats.jsx
│   │   │   └── PersonalInfo.jsx
│   │   ├── ResumeAnalyser/
│   │   │   ├── AnalysisStatus.jsx
│   │   │   ├── loader.jsx
│   │   │   ├── UploadZone.jsx
│   │   │   └── ResultTabs/
│   │   └── ui/
│   │       ├── Feature.jsx
│   │       ├── Footers.jsx
│   │       ├── Navbar.jsx
│   │       ├── Sidebar.jsx
│   │       └── Testimonial.jsx
│   ├── hooks/                  # Custom React hooks
│   │   └── use-mobile.js
│   ├── lib/                    # API and utility functions
│   │   ├── axios.js
│   │   └── utils.js
│   ├── pages/                  # Page components for routing
│   │   ├── Homepage.jsx
│   │   ├── EVOMFormPage.jsx
│   │   ├── EVOMPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── PortalPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── ResourcePage.jsx
│   │   └── ResumeAnalysisPage.jsx
│   ├── store/                  # Zustand or global state
│   │   ├── useAuthStore.js
│   │   ├── useFormStore.js
│   │   └── useEVOMStore.js
│   ├── App.jsx
│   ├── index.css
│   ├── Layout.jsx
│   └── main.jsx
├── .env.production              # Environment variables for production
├── components.json              # (Possibly Chakra or Storybook-related)
├── eslint.config.js
├── index.html
├── jsconfig.json
├── jsconfig.app.json
├── package.json
├── package-lock.json
├── README.md
└── vite.config.js               # Vite config with base path
```

## ⚙ Tech Stack

### 💻 Frontend
- *React.js*
- *Shadcn/UI*
- *Vite* as bundler
- *Tailwind CSS* for styling
- *Radix UI* for accessible UI primitives
- *Zustand* for global state management

### ☁ Backend (planned)
- *Node.js* + *Express*
- *MongoDB* for data storage (user, sessions, resume, results)
- *Socket.io* for real-time EVOM interaction (future)
- *JWT* for authentication

### AI Integration
- *OpenAI / GPT* for:
  - Mock session simulation
  - Resume feedback generation
  - Scoring logic based on language and context understanding

---

## Installation & Setup

```bash
# Clone the repository
git clone https://github.com/your-username/EVOM.git

# Install dependencies
cd frontend
npm install

# If vite isn't recognized
npm install -g vite

# Run development server
npm run dev
```

## Event
This project was developed for Dev Heat.
