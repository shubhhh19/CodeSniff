from flask import Blueprint, jsonify, request
import requests
import os
import re
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Debug: Print the loaded API keys
print("ANTHROPIC_API_KEY loaded:", bool(os.getenv("ANTHROPIC_API_KEY")))

code_review_bp = Blueprint("code_review", __name__)

# Anthropic Claude API Configuration
ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages"
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")

# Language detection patterns
LANGUAGE_PATTERNS = {
    "python": [r"def\s+\w+\(", r"import\s+\w+", r"from\s+\w+\s+import", r"class\s+\w+:", r"if\s+__name__\s*==\s*['\"]__main__['\"]"],
    "javascript": [r"function\s+\w+\(", r"const\s+\w+\s*=", r"let\s+\w+\s*=", r"var\s+\w+\s*=", r"=>", r"console\.log"],
    "typescript": [r"interface\s+\w+", r"type\s+\w+\s*=", r":\s*\w+\s*=", r"function\s+\w+\(.*\):\s*\w+"],
    "java": [r"public\s+class\s+\w+", r"public\s+static\s+void\s+main", r"import\s+java\.", r"@Override"],
    "cpp": [r"#include\s*<", r"int\s+main\s*\(", r"std::", r"cout\s*<<", r"cin\s*>>"],
    "c": [r"#include\s*<", r"int\s+main\s*\(", r"printf\s*\(", r"scanf\s*\("],
    "csharp": [r"using\s+System", r"public\s+class\s+\w+", r"static\s+void\s+Main", r"Console\.WriteLine"],
    "go": [r"package\s+\w+", r"func\s+\w+\(", r"import\s*\(", r"fmt\.Print"],
    "rust": [r"fn\s+\w+\(", r"let\s+\w+\s*=", r"use\s+std::", r"println!"],
    "php": [r"<\?php", r"function\s+\w+\(", r"\$\w+\s*=", r"echo\s+"],
    "ruby": [r"def\s+\w+", r"class\s+\w+", r"require\s+", r"puts\s+"],
    "swift": [r"func\s+\w+\(", r"var\s+\w+\s*=", r"let\s+\w+\s*=", r"import\s+Foundation"],
    "kotlin": [r"fun\s+\w+\(", r"val\s+\w+\s*=", r"var\s+\w+\s*=", r"package\s+\w+"],
    "scala": [r"def\s+\w+\(", r"val\s+\w+\s*=", r"var\s+\w+\s*=", r"object\s+\w+"],
    "html": [r"<html", r"<head>", r"<body>", r"<div", r"<!DOCTYPE"],
    "css": [r"\w+\s*\{", r":\s*\w+;", r"@media", r"#\w+\s*\{"],
    "sql": [r"SELECT\s+", r"FROM\s+\w+", r"WHERE\s+", r"INSERT\s+INTO", r"CREATE\s+TABLE"],
    "bash": [r"#!/bin/bash", r"echo\s+", r"if\s*\[", r"for\s+\w+\s+in"],
    "json": [r"^\s*\{", r"^\s*\[", r"\"\w+\"\s*:", r":\s*\""],
    "xml": [r"<\?xml", r"<\w+.*>", r"</\w+>"],
    "yaml": [r"^\w+:", r"^\s*-\s+\w+", r"---"]
}

def detect_language(code):
    """Detect programming language based on code patterns"""
    code_lower = code.lower()
    scores = {}
    
    for language, patterns in LANGUAGE_PATTERNS.items():
        score = 0
        for pattern in patterns:
            matches = len(re.findall(pattern, code, re.MULTILINE | re.IGNORECASE))
            score += matches
        scores[language] = score
    
    # Return the language with the highest score, or "unknown" if no matches
    if scores and max(scores.values()) > 0:
        return max(scores, key=scores.get)
    return "unknown"

def create_review_prompt(code, language):
    """Create a structured prompt for code review"""
    return f"""Review this {language} code and provide feedback:

```{language}
{code}
```

Please analyze the code for:
- Bugs and issues
- Optimization opportunities  
- Best practices
- Security concerns
- Performance improvements

Be constructive and specific in your feedback."""

def call_claude_api(prompt):
    """Call Anthropic Claude API"""
    headers = {
        "x-api-key": ANTHROPIC_API_KEY,
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01"
    }
    
    payload = {
        "model": "claude-3-haiku-20240307",
        "max_tokens": 1000,
        "temperature": 0.1,
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ]
    }
    
    try:
        response = requests.post(ANTHROPIC_API_URL, headers=headers, json=payload, timeout=60)
        response.raise_for_status()
        result = response.json()
        return result['content'][0]['text']
    except requests.exceptions.RequestException as e:
        raise Exception(f"Claude API request failed: {str(e)}")
    except Exception as e:
        raise Exception(f"Claude API error: {str(e)}")

@code_review_bp.route("/review", methods=["POST"])
def review_code():
    """Main endpoint for code review"""
    try:
        data = request.get_json()
        
        if not data or "code" not in data:
            return jsonify({"error": "Code is required"}), 400
        
        code = data["code"].strip()
        if not code:
            return jsonify({"error": "Code cannot be empty"}), 400
        
        # Detect language or use provided language
        detected_language = data.get("language") or detect_language(code)
        
        # Create review prompt
        prompt = create_review_prompt(code, detected_language)
        
        # Call Claude API
        try:
            if not ANTHROPIC_API_KEY:
                return jsonify({"error": "Anthropic API key not configured"}), 500
            
            review_content = call_claude_api(prompt)
            
            return jsonify({
                "success": True,
                "review": review_content,
                "detected_language": detected_language,
                "code_length": len(code),
                "timestamp": None
            })
        except Exception as e:
            return jsonify({"error": f"Claude API error: {str(e)}"}), 500
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@code_review_bp.route("/languages", methods=["GET"])
def get_supported_languages():
    """Get list of supported programming languages"""
    languages = list(LANGUAGE_PATTERNS.keys())
    return jsonify({
        "success": True,
        "languages": sorted(languages),
        "total": len(languages)
    })

@code_review_bp.route("/detect-language", methods=["POST"])
def detect_code_language():
    """Detect programming language from code snippet"""
    try:
        data = request.get_json()
        
        if not data or "code" not in data:
            return jsonify({"error": "Code is required"}), 400
        
        code = data["code"].strip()
        if not code:
            return jsonify({"error": "Code cannot be empty"}), 400
        
        detected_language = detect_language(code)
        
        return jsonify({
            "success": True,
            "detected_language": detected_language,
            "confidence": "high" if detected_language != "unknown" else "low"
        })
        
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@code_review_bp.route("/health", methods=["GET"])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "success": True,
        "service": "AI Code Reviewer API",
        "status": "healthy",
        "claude_configured": bool(os.getenv("ANTHROPIC_API_KEY"))
    })

@code_review_bp.route("/test-api", methods=["GET"])
def test_claude_api():
    """Test Claude API connection"""
    try:
        if not ANTHROPIC_API_KEY:
            return jsonify({"error": "Anthropic API key not configured"}), 500
        
        # Test with a simple prompt
        test_prompt = "Hello, this is a test."
        response = call_claude_api(test_prompt)
        
        return jsonify({
            "success": True,
            "message": "Claude API is working",
            "response": response
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e),
            "message": "Claude API test failed"
        }), 500

