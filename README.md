# 🏛️ ARCHITECT AI — High-Performance Productivity Suite

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

**Architect AI** is a premium, full-stack productivity ecosystem designed for elite focus and deep work. It leverages an AI-powered core to help users organize tasks, measure performance, and eliminate distractions through a stunning, glassmorphic mobile interface.

---

## ✨ Key Features

- **🧠 Smart Prioritization**: Our AI engine analyzes your behavior to suggest the most impactful tasks for your day.
- **🛡️ Deep Work Modes**: Built-in focus timers and distraction-free UI to reach a flow state faster.
- **💎 Premium UX**: A high-end mobile experience featuring glassmorphism, Reanimated 4 micro-animations, and haptic feedback.
- **🌐 Global Reach**: Full i18n support with built-in English and Bahasa Indonesia localizations.
- **📊 Performance Analytics**: Integrated statistics to track your productivity score and success rates.

---

## 🏗️ Technical Architecture

```text
ARCHITECT-AI/
├── 🚀 backend/           # FastAPI / PostgreSQL / OpenAI Real-time
├── 📱 mobile/            # React Native (Expo) / Reanimated 4 / Lucide
└── 📜 README.md          # Global Documentation
```

---

## 🚀 Quick Start Guide

### 1. Initialization
Clone the repository and ensure you have **Node.js (v20+)** and **Python (3.10+)** installed.

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt
# Copy .env.example to .env and fill in your keys
uvicorn app.main:app --reload
```

### 3. Mobile Setup
```bash
cd mobile
npm install
npx expo start
```

---

## 🛠️ Security & Environments

This project utilizes environment variables for all sensitive configuration (Database URLs, JWT Secrets, OpenAI Keys). 

> [!CAUTION]
> **Never commit your `.env` files.** We have provided a comprehensive root `.gitignore` to ensure these files remain local.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<p align="center">
  Designed with ❤️ by the Architect AI Team.
</p>
