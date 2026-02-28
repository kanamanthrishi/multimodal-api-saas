# 🚀 Multimodal API SaaS Platform

A production-grade SaaS backend with API key management, usage tracking, rate limiting, and plan-based access control — built with Node.js, Express, MongoDB, and React.

---

## 📌 Project Overview

This project simulates a real-world SaaS platform where users:

- Sign up and log in securely
- Generate API keys
- Track usage
- Upgrade plans (Free / Pro)
- View analytics dashboard
- Experience rate limiting and security protections

This backend is fully structured using MVC architecture and production-ready practices.

---

## 🛠 Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- express-validator
- Helmet (Security)
- express-rate-limit

### Frontend
- React (Vite)
- Tailwind CSS
- Fetch API

---

## 🔐 Features

### Authentication
- Secure signup & login
- JWT-based protected routes
- Password hashing with bcrypt

### API Key Management
- Generate API keys
- Soft revoke keys
- Plan-based key limits
- Usage limits per key

### SaaS Plan Logic
- Free Plan (3 keys, limited usage)
- Pro Plan (10 keys, higher usage)

### Analytics Dashboard
- Total keys
- Active keys
- Revoked keys
- Total API requests
- Total usage consumed

### Security & Production Hardening
- Helmet security headers
- Rate limiting
- Input validation middleware
- Centralized error handling
- Async handler utility
- Clean MVC structure

---

## 📂 Project Structure
