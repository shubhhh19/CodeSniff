import os
import sys
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from src.models.user import db
from src.routes.user import user_bp
from src.routes.code_review import code_review_bp

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'asdf#FGSgvasgf$5$WGT')

# Enable CORS for all routes
CORS(app, origins=os.getenv('CORS_ORIGINS', '*').split(','))

# Register blueprints
app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(code_review_bp, url_prefix='/api')

# uncomment if you need to use database
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(os.path.dirname(__file__), 'database', 'app.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)
with app.app_context():
    db.create_all()

@app.route("/")
def home():
    """Home endpoint"""
    return jsonify({
        "message": "AI Code Reviewer API",
        "status": "running",
        "endpoints": [
            "/api/health",
            "/api/review",
            "/api/detect-language",
            "/api/languages"
        ]
    })

@app.route("/health", methods=["GET"])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "success": True,
        "service": "AI Code Reviewer API",
        "status": "healthy",
        "claude_configured": bool(os.getenv("CLAUDE_API_KEY"))
    })

@app.route("/api/health", methods=["GET"])
def api_health_check():
    """API health check endpoint"""
    return jsonify({
        "success": True,
        "service": "AI Code Reviewer API",
        "status": "healthy",
        "claude_configured": bool(os.getenv("CLAUDE_API_KEY"))
    })

if __name__ == '__main__':
    # Use PORT environment variable for deployment
    port = int(os.getenv('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=False)