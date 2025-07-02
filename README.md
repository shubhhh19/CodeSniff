# CodeSniff

A full-stack web application for intelligent, context-aware code reviews using AI. Paste or upload your code and receive detailed feedback on bugs, optimizations, best practices, and security concerns.

---

## 🚀 Features

- **AI-Powered Code Review:** Uses Anthropic Claude for deep, context-aware code analysis.
- **Multi-Language Support:** 20+ programming languages, with automatic detection.
- **Modern UI:** Minimal, responsive React interface with whitespace, large headings, and subtle animations.
- **Code History:** View and revisit past code reviews.
- **Code Explain:** Get brief, AI-generated explanations for code snippets.
- **File Upload & Editor:** Paste code or upload files; syntax highlighting included.
- **Informational Footer:** About, Features, Supported Languages, and credits.
- **Report Issues:** Quick access to report bugs or feedback.
- **Clear Buttons:** Instantly clear code input or explanations.

---

## 🛠️ Installation & Run Instructions

### Prerequisites
- **Python 3.11+** (for backend)
- **Node.js 18+** (for frontend)
- **Anthropic Claude API Key** (get from Anthropic)

### 1. Clone the Repository
```bash
git clone https://github.com/shubhhh19/CodeSniff.git
cd CodeSniff
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Environment Configuration
Create a `.env` file in `backend/`:
```
CLAUDE_API_KEY=your_anthropic_api_key_here
FLASK_ENV=development
SECRET_KEY=your_secret_key_here
CORS_ORIGINS=*
```

### 4. Frontend Setup
```bash
cd ../frontend
npm install  # or pnpm install
```

### 5. Development Mode
- **Backend:**
  ```bash
  cd backend
  source venv/bin/activate
  python src/main.py
  ```
- **Frontend:**
  ```bash
  cd frontend
  npm run dev
  ```
- Visit: [http://localhost:5173](http://localhost:5173)

### 6. Production Build
```bash
cd frontend
npm run build
cp -r dist/* ../backend/src/static/
cd ../backend
source venv/bin/activate
python src/main.py
```
- Visit: [http://localhost:5001](http://localhost:5001)

---

## ✨ Interesting Parts During the Build Process

- **AI Service Integration:**
  - Started with Google Gemini, then Hugging Face (GPT-2, StarCoder, etc.), and finally Anthropic Claude for best results and reliability.
  - Handled model availability, API key management, and error handling for multiple providers.
- **Frontend-Backend Proxying:**
  - Solved CORS and 404 issues by configuring Vite to proxy `/api` requests to Flask backend.
- **UI/UX Polish:**
  - Iteratively improved the UI for whitespace, clarity, and modern feel.
  - Added history, code explain, and clear buttons for better usability.
- **Commit History:**
  - Created a realistic, job-ready commit history with staged, backdated commits and proper .gitignore.
- **Deployment Ready:**
  - Structured for easy deployment to platforms like Railway, Render, Vercel, or Netlify.

---

## 🧩 Difficulties Faced & Solutions

- **AI Model Access:**
  - *Problem:* Many Hugging Face models were unavailable or required payment.
  - *Solution:* Switched to Anthropic Claude, which provided reliable, high-quality code reviews.
- **API Proxying & CORS:**
  - *Problem:* Frontend 404 errors and CORS issues.
  - *Solution:* Configured Vite proxy and Flask CORS settings.
- **Sensitive Files in Git:**
  - *Problem:* Accidentally pushed large or sensitive files (venv, .env, node_modules).
  - *Solution:* Added a robust .gitignore and re-initialized the repo.
- **UI Complexity:**
  - *Problem:* Balancing minimalism with feature-richness.
  - *Solution:* Iterative design, user feedback, and modular React components.
- **Deployment:**
  - *Problem:* Ensuring smooth deployment and environment variable management.
  - *Solution:* Documented clear instructions and tested on multiple platforms.

---

## 🖼️ Screenshots

> **Add your screenshots here!**
> - Place images in `frontend/public/` or use external links.
> - Example:
>
> ![Home Page](frontend/public/screenshot-home.png)
> ![Code Review Result](frontend/public/screenshot-result.png)

---

## 📄 License
MIT

---

**Built with ❤️ by Shubh Soni. [Portfolio](https://shubhsoni.me)**