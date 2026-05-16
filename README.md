# Hired.ai – AI-Powered Interview Preparation Platform

Live Application: 

---

## Overview

hired.ai is an AI-powered interview preparation platform designed to help users practice technical and HR interview questions tailored to their role and experience level. The platform integrates Google Gemini API to dynamically generate relevant interview questions and provides an AI-driven feedback and evaluation system that analyzes user responses, offering insights and improvement suggestions. This enables users to simulate real interview scenarios and improve their preparation effectively.

---

## Key Features

* AI-driven interview question generation using Google Gemini API
* Role-based and experience-based question customization
* User authentication and session handling
* Real-time interaction with backend APIs
* Responsive and user-friendly interface
* AI-driven feedback and evaluation system
* Cloud deployment with seamless scalability

---

## System Architecture

The application follows a full-stack architecture:

* Frontend handles user interaction and displays generated questions
* Backend processes requests, integrates with AI services, and manages business logic
* Database stores user data and session-related information
* External AI service (Gemini API) generates dynamic interview content

---

## Tech Stack

### Frontend

* React.js
* Axios

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas

### AI Integration

* Google Gemini API

### Deployment

* Vercel

---

## Installation and Setup

### Prerequisites

* Node.js (v18 or above recommended)
* MongoDB Atlas account
* Google Gemini API key

---

### Steps to Run Locally

Clone the repository:

```bash
git clone https://github.com/Amolraut638/hired.ai.git
cd hired.ai
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the root directory and add:

```env
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
```

Start the development server:

```bash
npm run dev
```

---

## API Design

### Endpoint: Generate Interview Questions

**POST** `/api/generate-questions`

### Request Body:

```json
{
  "role": "Frontend Developer",
  "experience": "2 years"
}
```

### Response:

```json
{
  "questions": [
    "Explain React lifecycle methods.",
    "What is the Virtual DOM and how does it work?"
  ]
}
```

---

## Security Practices

* Environment variables are managed using `.env` and excluded via `.gitignore`
* API keys are not hardcoded in the source code
* Sensitive configuration is handled securely in deployment environments

---

## Future Enhancements

* Adding mentors to gain real expreience and human touch.
* Performance analytics dashboard
* Enhanced personalization based on user history
* Mobile-first optimization

---

## Authors

Amol Raut
GitHub: https://github.com/Amolraut638

---

## License

This project is developed for educational and interview preparation purposes.
