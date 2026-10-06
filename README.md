# 🦉 Duolingo Clone — Full-Stack Language Learning Platform

<p align="center">
  <strong>A modern, full-stack Duolingo-inspired language learning experience built with Next.js, TypeScript, FastAPI and SQLite.</strong>
</p>

<p align="center">
  <a href="https://duolingo-clone-indol-eta.vercel.app/">
    <img src="https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel" alt="Live Demo">
  </a>
  <a href="https://duolingo-clone-1-ncqi.onrender.com/docs">
    <img src="https://img.shields.io/badge/API%20Docs-FastAPI-009688?style=for-the-badge&logo=fastapi" alt="API Docs">
  </a>
  <a href="https://github.com/Shubrat111204/Duolingo_Clone">
    <img src="https://img.shields.io/badge/Source%20Code-GitHub-black?style=for-the-badge&logo=github" alt="GitHub">
  </a>
</p>

---

## 👨‍💻 Developer

**Shubrat Mishra**  
**B.Tech — Computer Science & Engineering**  
**Vellore Institute of Technology (VIT)**

---

## 🎯 Challenge Information

This project was developed as a **Full-Stack SDE Take-Home Assignment** as part of the hiring process with **Scaler AI Labs Careers**.

### Challenge

> **Duolingo Clone — SDE Fullstack Assignment**

The objective was to build a functional language-learning web application inspired by the Duolingo experience, including:

- Learning path / skill progression
- Interactive lessons
- Multiple exercise types
- XP and streak system
- Hearts system
- Leaderboard
- Learner profile
- Persistent learner progress
- Gamified UI and feedback
- Seeded course content

### Challenge Communication

> Hi Shubrat,  
>   
> Congratulations on clearing the challenge. Your next round is a take-home assignment: Duolingo Clone.  
>   
> **Assignment brief:**  
> https://docs.google.com/document/d/11nNKzKTzUIgLgaqKSrMmtVAPAuxHAYlJPWSqiQWlLDk/edit  
>   
> **Submission:**  
> https://forms.gle/YoM47ogDanmgDJaW8  
>   
> **Submission deadline:** Wednesday, 7th October, 6:00 PM  
>   
> Best,  
> Scaler AI Labs Careers

---

# 🚀 Live Application

### 🌐 Frontend — Vercel

**Live Demo:**  
https://duolingo-clone-indol-eta.vercel.app/

### ⚙️ Backend — Render

**Backend:**  
https://duolingo-clone-1-ncqi.onrender.com

### 📖 API Documentation

**FastAPI Swagger UI:**  
https://duolingo-clone-1-ncqi.onrender.com/docs

### 💻 GitHub Repository

https://github.com/Shubrat111204/Duolingo_Clone

---

# 📸 Application Preview

The screenshots below are taken from the actual implementation of this project.

## 🗺️ Learning Path

![Learning Path](docs/screenshots/learning-path.png)

The learning path provides a visual progression through units and skills, with available, completed and locked states.

---

## 📚 Interactive Lesson

![Lesson Player](docs/screenshots/lesson.png)

The lesson player contains multiple exercise formats with immediate feedback, progress tracking and the heart system.

---

## 🏆 Leaderboard

![Leaderboard](docs/screenshots/leaderboard.png)

The leaderboard provides a gamified comparison of learner XP using seeded learner data.

---

## 👤 Learner Profile

![Profile](docs/screenshots/profile.png)

The profile section displays learner statistics including XP, streak and learning progress.

---

# ✨ Key Features

## 🗺️ Learning Path

- Visual learning path inspired by modern language-learning applications
- Units and skills
- Locked and unlocked progression
- Completed skill states
- Progress indicators
- Skill-based lesson navigation

## 📚 Interactive Lesson System

The application supports multiple exercise formats:

- Multiple Choice
- Translate / Word Bank
- Match Pairs
- Fill in the Blank
- Type the Answer

Each exercise provides:

- Immediate feedback
- Correct / incorrect states
- Lesson progress tracking
- Heart deduction on incorrect answers
- XP progression
- Completion handling

---

## ❤️ Hearts System

Learners have a limited number of hearts during lessons.

- Incorrect answers consume hearts
- Lesson failure is handled when hearts are exhausted
- Hearts can be restored through the application's refill/practice functionality
- Heart state is maintained through the backend

---

## ⚡ XP & Gamification

The application includes:

- XP accumulation
- Daily XP goal
- Streak tracking
- Leaderboard
- Lesson completion rewards
- Learner statistics
- Mocked gems
- Progress tracking

---

## 🔥 Streak System

The application maintains learner activity through a streak system.

The backend stores the learner's streak information and supports simulated day progression for testing the streak workflow.

---

## 🏆 Leaderboard

A seeded leaderboard provides a gamified comparison between learners.

Leaderboard information is retrieved through the backend API.

---

## 👤 Learner Profile

The profile page provides:

- Total XP
- Current streak
- Learning statistics
- Progress information
- Achievement-style information

---

## 🌙 UI / UX

The interface focuses on recreating the playful characteristics expected from a modern language-learning platform:

- Gamified visual hierarchy
- Colorful interface
- Rounded cards and buttons
- Progress indicators
- Feedback states
- Completion celebrations
- Toast notifications
- Modal interactions
- Responsive layouts
- Dark-mode support

The visual design was implemented independently for this project while following the assignment's requirement to closely reproduce the expected Duolingo-style learning experience.

---

# 🛠️ Tech Stack

## Frontend

- **Next.js 14**
- **TypeScript**
- **React**
- **CSS / Tailwind CSS**
- **Next.js App Router**

## Backend

- **Python**
- **FastAPI**
- **SQLAlchemy**
- **Pydantic**
- **Uvicorn**

## Database

- **SQLite**

## Deployment

- **Vercel** — Frontend
- **Render** — Backend

## Development Tools

- Git
- GitHub
- VS Code
- npm
- Python virtual environment

---

# 🏗️ System Architecture

```text
                         ┌──────────────────────────┐
                         │       User / Browser     │
                         └────────────┬─────────────┘
                                      │
                                      ▼
                         ┌──────────────────────────┐
                         │        Next.js           │
                         │       TypeScript         │
                         │        Frontend          │
                         │         Vercel           │
                         └────────────┬─────────────┘
                                      │
                              REST API / JSON
                                      │
                                      ▼
                         ┌──────────────────────────┐
                         │         FastAPI          │
                         │      Python Backend      │
                         │          Render          │
                         └────────────┬─────────────┘
                                      │
                                      ▼
                         ┌──────────────────────────┐
                         │         SQLite           │
                         │       SQLAlchemy         │
                         └──────────────────────────┘
