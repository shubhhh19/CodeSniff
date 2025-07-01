# AI Code Reviewer

A full-stack web application that provides intelligent, context-aware code reviews using AI. Upload or paste your code and receive detailed feedback on bugs, optimizations, best practices, and security concerns.

![AI Code Reviewer](https://img.shields.io/badge/AI-Code%20Reviewer-blue)
![React](https://img.shields.io/badge/React-18.x-blue)
![Flask](https://img.shields.io/badge/Flask-3.x-green)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-orange)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🚀 Features

### Core Functionality
- **AI-Powered Code Review**: Leverages OpenAI GPT-4 for intelligent code analysis
- **Multi-Language Support**: Supports 25+ programming languages with automatic detection
- **Dual Input Methods**: Monaco Editor with syntax highlighting or simple text area with file upload
- **Comprehensive Analysis**: Provides bugs detection, optimization suggestions, best practices, and security insights
- **Real-time Language Detection**: Automatically identifies programming language from code patterns

### User Experience
- **Modern UI**: Clean, professional interface built with React and Tailwind CSS
- **Dark/Light Mode**: Toggle between themes for comfortable coding
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Copy to Clipboard**: Easy sharing of review results
- **File Upload Support**: Drag and drop or browse for code files
- **Loading States**: Clear feedback during AI processing

### Technical Features
- **RESTful API**: Well-structured backend with comprehensive endpoints
- **CORS Support**: Proper cross-origin resource sharing configuration
- **Error Handling**: Robust error management and user feedback
- **Production Ready**: Optimized build process and deployment configuration

## 🏗️ Architecture

### Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 18 + Vite | Modern UI framework with fast development |
| **Styling** | Tailwind CSS + shadcn/ui | Utility-first CSS with pre-built components |
| **Code Editor** | Monaco Editor | VS Code-like editing experience |
| **Backend** | Flask 3.x | Lightweight Python web framework |
| **AI Service** | OpenAI GPT-4 API | Advanced language model for code analysis |
| **HTTP Client** | Axios | Promise-based HTTP requests |
| **Build Tool** | Vite | Fast frontend build tool |

### Project Structure

```
ai-code-reviewer/
├── backend/                 # Flask backend application
│   ├── src/
│   │   ├── routes/         # API route handlers
│   │   │   ├── code_review.py    # Code review endpoints
│   │   │   └── user.py           # User management (template)
│   │   ├── models/         # Database models
│   │   ├── static/         # Built frontend files
│   │   └── main.py         # Flask application entry point
│   ├── venv/               # Python virtual environment
│   ├── requirements.txt    # Python dependencies
│   └── .env               # Environment variables
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   │   └── ui/        # shadcn/ui components
│   │   ├── assets/        # Static assets
│   │   ├── App.jsx        # Main application component
│   │   └── main.jsx       # React entry point
│   ├── dist/              # Built frontend files
│   ├── package.json       # Node.js dependencies
│   └── vite.config.js     # Vite configuration
├── README.md              # This file
└── todo.md               # Development progress tracker
```

## 🛠️ Installation & Setup

### Prerequisites

- **Python 3.11+**: Required for Flask backend
- **Node.js 18+**: Required for React frontend
- **Hugging Face API Key**: Required for AI code review functionality (free to generate)

### Quick Start

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd ai-code-reviewer
   ```

2. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env and add your Hugging Face API key
   ```

4. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install  # or pnpm install
   ```

5. **Build and Deploy**
   ```bash
   npm run build
   cp -r dist/* ../backend/src/static/
   ```

6. **Start the Application**
   ```bash
   cd ../backend
   source venv/bin/activate
   python src/main.py
   ```

7. **Access the Application**
   Open your browser and navigate to `http://localhost:5001`

### Development Mode

For development with hot reloading:

1. **Start Backend** (Terminal 1)
   ```bash
   cd backend
   source venv/bin/activate
   python src/main.py
   ```

2. **Start Frontend** (Terminal 2)
   ```bash
   cd frontend
   npm run dev
   ```

Access development server at `http://localhost:5173`

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Hugging Face API Configuration
HUGGINGFACE_API_KEY=hf_your_huggingface_api_key_here

# Flask Configuration
FLASK_ENV=development
SECRET_KEY=your_secret_key_here

# CORS Configuration
CORS_ORIGINS=*
```

### Supported File Types

The application accepts the following file extensions:
- **JavaScript/TypeScript**: `.js`, `.jsx`, `.ts`, `.tsx`
- **Python**: `.py`
- **Java**: `.java`
- **C/C++**: `.c`, `.cpp`, `.h`, `.hpp`
- **C#**: `.cs`
- **Go**: `.go`
- **Rust**: `.rs`
- **PHP**: `.php`
- **Ruby**: `.rb`
- **Swift**: `.swift`
- **Kotlin**: `.kt`
- **Scala**: `.scala`
- **Web**: `.html`, `.css`
- **Data**: `.sql`, `.json`, `.xml`, `.yaml`, `.yml`
- **Shell**: `.sh`

## 🔌 API Documentation

### Base URL
```
http://localhost:5001/api
```

### Endpoints

#### 1. Health Check
```http
GET /health
```

**Response:**
```json
{
  "success": true,
  "service": "AI Code Reviewer API",
  "status": "healthy",
  "huggingface_configured": true
}
```

#### 2. Code Review
```http
POST /review
```

**Request Body:**
```json
{
  "code": "def hello_world():\n    print(\'Hello, World!\')",
  "language": "python"  // Optional, auto-detected if not provided
}
```

**Response:**
```json
{
  "success": true,
  "review": "Detailed AI review content...",
  "detected_language": "python",
  "code_length": 45,
  "timestamp": null
}
```

#### 3. Language Detection
```http
POST /detect-language
```

**Request Body:**
```json
{
  "code": "function hello() { console.log(\'Hello!\'); }"
}
```

**Response:**
```json
{
  "success": true,
  "detected_language": "javascript",
  "confidence": "high"
}
```

#### 4. Supported Languages
```http
GET /languages
```

**Response:**
```json
{
  "success": true,
  "languages": ["python", "javascript", "java", "..."],
  "total": 25
}
```

## 🚀 Deployment

### Production Deployment

#### Option 1: Single Server Deployment

1. **Prepare the Application**
   ```bash
   cd frontend
   npm run build
   cp -r dist/* ../backend/src/static/
   ```

2. **Set Production Environment**
   ```bash
   cd backend
   export FLASK_ENV=production
   export HUGGINGFACE_API_KEY=your_production_api_key
   ```

3. **Install Production Dependencies**
   ```bash
   pip install gunicorn
   ```

4. **Start with Gunicorn**
   ```bash
   gunicorn -w 4 -b 0.0.0.0:5001 src.main:app
   ```

#### Option 2: Docker Deployment

Create `Dockerfile` in the root directory:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install Node.js for building frontend
RUN apt-get update && apt-get install -y nodejs npm

# Copy and build frontend
COPY frontend/ ./frontend/
WORKDIR /app/frontend
RUN npm install && npm run build

# Setup backend
WORKDIR /app
COPY backend/ ./backend/
RUN cp -r frontend/dist/* backend/src/static/

# Install Python dependencies
WORKDIR /app/backend
RUN pip install -r requirements.txt

# Expose port
EXPOSE 5001

# Start application
CMD ["python", "src/main.py"]
```

Build and run:
```bash
docker build -t ai-code-reviewer .
docker run -p 5001:5001 -e HUGGINGFACE_API_KEY=your_key ai-code-reviewer
```

#### Option 3: Cloud Platform Deployment

**Render/Railway/Fly.io:**
1. Connect your GitHub repository
2. Set environment variables in the platform dashboard
3. Configure build command: `cd frontend && npm install && npm run build && cp -r dist/* ../backend/src/static/`
4. Configure start command: `cd backend && pip install -r requirements.txt && python src/main.py`

**Vercel (Frontend) + Render (Backend):**
1. Deploy frontend to Vercel
2. Deploy backend to Render
3. Update frontend API base URL to point to Render backend

### Environment Variables for Production

```env
HUGGINGFACE_API_KEY=hf_your_production_huggingface_api_key
FLASK_ENV=production
SECRET_KEY=your_secure_secret_key
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

## 🧪 Testing

### Manual Testing Checklist

- [ ] Application loads successfully
- [ ] Code editor displays with syntax highlighting
- [ ] File upload functionality works
- [ ] Language detection is accurate
- [ ] Dark/light mode toggle functions
- [ ] API endpoints respond correctly
- [ ] Error handling displays appropriate messages
- [ ] Responsive design works on mobile devices

### API Testing with curl

```bash
# Health check
curl -X GET http://localhost:5001/api/health

# Language detection
curl -X POST http://localhost:5001/api/detect-language \
  -H "Content-Type: application/json" \
  -d \'{"code": "def hello(): print(\"Hello\")"}\'

# Code review (requires valid Hugging Face API key)
curl -X POST http://localhost:5001/api/review \
  -H "Content-Type: application/json" \
  -d \'{"code": "def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n-1)"}\'
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Hugging Face API Key Error
**Problem:** `Hugging Face API error: Unauthorized` or `Invalid API key`
**Solution:** 
- Verify your API key is correct in the `.env` file
- Ensure you have sufficient credits or access to the model on Hugging Face
- Check that the API key has the necessary permissions

#### 2. CORS Errors
**Problem:** Cross-origin request blocked
**Solution:**
- Ensure CORS is properly configured in Flask
- Check that `CORS_ORIGINS` environment variable includes your frontend domain

#### 3. Module Not Found Errors
**Problem:** `ModuleNotFoundError` when starting the backend
**Solution:**
- Activate the virtual environment: `source venv/bin/activate`
- Install dependencies: `pip install -r requirements.txt`

#### 4. Frontend Build Issues
**Problem:** Build fails or assets not loading
**Solution:**
- Clear node_modules: `rm -rf node_modules && npm install`
- Ensure all dependencies are installed
- Check for TypeScript/JavaScript syntax errors

#### 5. Port Already in Use
**Problem:** `Address already in use` error
**Solution:**
- Kill existing processes: `pkill -f "python src/main.py"`
- Use a different port by modifying the Flask app configuration

### Performance Optimization

1. **Frontend Optimization**
   - Enable gzip compression
   - Implement code splitting for large applications
   - Optimize images and assets

2. **Backend Optimization**
   - Implement request rate limiting
   - Add caching for language detection results
   - Use connection pooling for database operations

3. **AI Service Optimization**
   - Implement request queuing for high traffic
   - Add retry logic for API failures
   - Consider using streaming responses for large code reviews

## 🤝 Contributing

### Development Guidelines

1. **Code Style**
   - Follow PEP 8 for Python code
   - Use ESLint and Prettier for JavaScript/React code
   - Write descriptive commit messages

2. **Testing**
   - Add unit tests for new API endpoints
   - Test UI components with React Testing Library
   - Ensure cross-browser compatibility

3. **Documentation**
   - Update README for new features
   - Document API changes
   - Include code comments for complex logic

### Submitting Changes

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -m "Add new feature"`
5. Push to the branch: `git push origin feature/new-feature`
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Hugging Face** for providing the Inference API
- **Microsoft** for the Monaco Editor
- **Vercel** for the React and Tailwind CSS ecosystem
- **shadcn/ui** for the beautiful UI components
- **Flask** community for the excellent web framework

## 📞 Support

For support, please:
1. Check the troubleshooting section above
2. Search existing issues in the repository
3. Create a new issue with detailed information about your problem
4. Include your environment details (OS, Python version, Node.js version)

---

**Built with ❤️ by the AI Code Reviewer Team**