import { useState, useRef } from 'react'
import { Editor } from '@monaco-editor/react'
import axios from 'axios'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Loader2, Upload, Code, FileText, Moon, Sun, Copy, Check, Info, AlertCircle, ExternalLink } from 'lucide-react'
import './App.css'
import { formatDistanceToNow } from 'date-fns'

const API_BASE_URL = '/api'

function App() {
  const [code, setCode] = useState('')
  const [review, setReview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [detectedLanguage, setDetectedLanguage] = useState('unknown')
  const [darkMode, setDarkMode] = useState(false)
  const [inputMethod, setInputMethod] = useState('editor') // 'editor' or 'paste'
  const [copied, setCopied] = useState(false)
  const fileInputRef = useRef(null)
  const editorRef = useRef(null)
  const [reviewHistory, setReviewHistory] = useState([])
  const [explainCode, setExplainCode] = useState('')
  const [explainResult, setExplainResult] = useState(null)
  const [explainLoading, setExplainLoading] = useState(false)
  const [explainError, setExplainError] = useState(null)

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor
  }

  const handleCodeChange = (value) => {
    setCode(value || '')
    setError(null)
    if (value && value.trim()) {
      detectLanguage(value)
    }
  }

  const detectLanguage = async (codeToDetect) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/detect-language`, {
        code: codeToDetect
      })
      if (response.data.success) {
        setDetectedLanguage(response.data.detected_language)
      }
    } catch (err) {
      console.error('Language detection failed:', err)
    }
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target.result
        setCode(content)
        handleCodeChange(content)
      }
      reader.readAsText(file)
    }
  }

  const handleReviewCode = async () => {
    if (!code.trim()) {
      setError('Please enter some code to review')
      return
    }

    setLoading(true)
    setError(null)
    setReview(null)

    try {
      const response = await axios.post(`${API_BASE_URL}/review`, {
        code: code,
        language: detectedLanguage
      })

      if (response.data.success) {
        setReview(response.data)
        setReviewHistory(prev => [
          {
            ...response.data,
            code,
            detectedLanguage,
            timestamp: new Date().toISOString()
          },
          ...prev
        ])
      } else {
        setError(response.data.error || 'Review failed')
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to connect to the AI service')
    } finally {
      setLoading(false)
    }
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const formatReviewContent = (content) => {
    // Split content into sections and format
    const sections = content.split(/(?=\d+\.\s*\*\*|\*\*\d+\.)/g)
    return sections.map((section, index) => (
      <div key={index} className="mb-4">
        <div className="whitespace-pre-wrap text-sm leading-relaxed">
          {section.trim()}
        </div>
      </div>
    ))
  }

  const handleExplainCode = async () => {
    if (!explainCode.trim()) {
      setExplainError('Please enter some code to explain')
      return
    }
    setExplainLoading(true)
    setExplainError(null)
    setExplainResult(null)
    try {
      // If you have a backend endpoint, use it here. For now, use /review with a different prompt.
      const response = await axios.post(`${API_BASE_URL}/review`, {
        code: explainCode,
        language: detectedLanguage,
        explain: true // You can handle this in backend to use a different prompt
      })
      if (response.data.success) {
        setExplainResult(response.data.review)
      } else {
        setExplainError(response.data.error || 'Explanation failed')
      }
    } catch (err) {
      setExplainError(err.response?.data?.error || 'Failed to connect to the AI service')
    } finally {
      setExplainLoading(false)
    }
  }

  return (
    <div className={`min-h-screen bg-background text-foreground ${darkMode ? 'dark' : ''}`}>
      {/* Header with Report Issue button */}
      <div className="w-full bg-gradient-to-b from-primary/5 to-transparent py-8 mb-8 border-b">
        <div className="container mx-auto max-w-4xl px-4 flex items-center justify-between">
          <div className="text-left">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-2 tracking-tight">CodeSniff</h1>
            <p className="text-lg md:text-2xl text-muted-foreground mb-2">Get intelligent, instant feedback and explanations for your code.</p>
            <div className="text-sm text-muted-foreground">Made by <span className="font-semibold">Shubh Soni</span> — <a href="https://shubhsoni.framer.website/" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary ml-1">Portfolio</a></div>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="icon" className="h-10 w-10" title="Report an Issue">
              <a href="https://github.com/shubhsoni/codesniff/issues" target="_blank" rel="noopener noreferrer">
                <AlertCircle className="h-6 w-6" />
              </a>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleDarkMode}
              className="h-10 w-10"
              title="Toggle dark mode"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Tool Section: 3 columns on desktop, stacked on mobile */}
      <div id="main-tool" className="container mx-auto p-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Code Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Code Input</span>
                {detectedLanguage !== 'unknown' && (
                  <Badge variant="secondary">{detectedLanguage}</Badge>
                )}
              </CardTitle>
              <CardDescription>Paste your code or upload a file for review</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs value={inputMethod} onValueChange={setInputMethod} className="mb-2">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="editor">Code Editor</TabsTrigger>
                  <TabsTrigger value="paste">Paste/Upload</TabsTrigger>
                </TabsList>
                <TabsContent value="editor" className="space-y-4">
                  <div className="border rounded-md overflow-hidden">
                    <Editor
                      height="300px"
                      defaultLanguage="javascript"
                      language={detectedLanguage !== 'unknown' ? detectedLanguage : 'javascript'}
                      value={code}
                      onChange={handleCodeChange}
                      onMount={handleEditorDidMount}
                      theme={darkMode ? 'vs-dark' : 'light'}
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: 'on',
                        roundedSelection: false,
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                      }}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="paste" className="space-y-4">
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Paste your code here..."
                      value={code}
                      onChange={(e) => handleCodeChange(e.target.value)}
                      className="min-h-[200px] font-mono text-sm"
                    />
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center space-x-2"
                      >
                        <Upload className="h-4 w-4" />
                        <span>Upload File</span>
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.cs,.go,.rs,.php,.rb,.swift,.kt,.scala,.html,.css,.sql,.sh,.json,.xml,.yaml,.yml"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              <Button
                onClick={handleReviewCode}
                disabled={loading || !code.trim()}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Code...
                  </>
                ) : (
                  <>
                    <Code className="mr-2 h-4 w-4" />
                    Review Code
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className="w-full mt-2"
                onClick={() => {
                  setCode('');
                  setDetectedLanguage('unknown');
                  setReview(null);
                  setError(null);
                  setExplainCode('');
                  setExplainResult(null);
                  setExplainError(null);
                }}
                size="lg"
              >
                Clear
              </Button>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Result Section (center) */}
          <Card className="md:col-span-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Code className="h-5 w-5" />
                  <span>Result</span>
                </CardTitle>
                {(review || explainResult) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(review ? review.review : explainResult)}
                    className="flex items-center space-x-1"
                  >
                    {copied ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </Button>
                )}
              </div>
              <CardDescription>AI-generated review or explanation</CardDescription>
            </CardHeader>
            <CardContent>
              {(!review && !explainResult && !loading && !explainLoading) && (
                <div className="text-center py-12 text-muted-foreground">
                  <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Submit your code for AI review or explanation to see results here</p>
                </div>
              )}
              {(loading || explainLoading) && (
                <div className="text-center py-12">
                  <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin text-primary" />
                  <p className="text-muted-foreground">AI is analyzing your code...</p>
                </div>
              )}
              {review && !loading && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <Badge variant="outline">
                      Language: {review.detected_language}
                    </Badge>
                    <Badge variant="outline">
                      Lines: {review.code_length} chars
                    </Badge>
                  </div>
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <div className="bg-muted/50 rounded-lg p-4 max-h-[500px] overflow-y-auto">
                      {formatReviewContent(review.review)}
                    </div>
                  </div>
                </div>
              )}
              {explainResult && !explainLoading && (
                <div className="prose prose-sm max-w-none dark:prose-invert bg-muted/50 rounded-lg p-4 mt-2 animate-fade-in">
                  <div className="font-semibold mb-2">Explanation:</div>
                  <div>{explainResult}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Code Explain Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Code Explain</span>
              </CardTitle>
              <CardDescription>Paste your code to get a brief explanation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Paste your code here..."
                value={explainCode}
                onChange={e => setExplainCode(e.target.value)}
                className="min-h-[200px] font-mono text-sm"
              />
              <Button
                onClick={handleExplainCode}
                disabled={explainLoading || !explainCode.trim()}
                className="w-full"
                size="lg"
              >
                {explainLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Explaining...
                  </>
                ) : (
                  <>
                    <Info className="mr-2 h-4 w-4" />
                    Explain Code
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className="w-full mt-2"
                onClick={() => {
                  setExplainCode('');
                  setExplainResult(null);
                  setExplainError(null);
                }}
                size="lg"
              >
                Clear
              </Button>
              {explainError && (
                <Alert variant="destructive">
                  <AlertDescription>{explainError}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>

        {/* History Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>History</span>
              <Badge variant="secondary">{reviewHistory.length}</Badge>
            </CardTitle>
            <CardDescription>Past code reviews (session only)</CardDescription>
          </CardHeader>
          <CardContent>
            {reviewHistory.length === 0 ? (
              <div className="text-muted-foreground text-center py-4">No history yet.</div>
            ) : (
              <div className="space-y-2">
                {reviewHistory.map((item, idx) => (
                  <div
                    key={idx}
                    className={`rounded-lg p-3 transition hover:bg-muted/70 cursor-pointer border ${review === item ? 'border-primary' : 'border-transparent'}`}
                    onClick={() => setReview(item)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{item.detected_language}</Badge>
                        <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{item.code_length} chars</span>
                    </div>
                    <pre className="mt-1 text-xs text-muted-foreground line-clamp-1">{item.code.slice(0, 80)}{item.code.length > 80 ? '...' : ''}</pre>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer Info Section */}
        <footer className="mt-12 py-8 border-t bg-background">
          <div className="container mx-auto max-w-4xl px-4 grid md:grid-cols-3 gap-8 text-sm text-muted-foreground">
            <div>
              <h3 className="font-bold mb-2">About</h3>
              <p>CodeSniff is your personal code review assistant. Paste or upload your code, and get instant, actionable feedback powered by state-of-the-art AI. Perfect for students, professionals, and anyone who wants to write better code.</p>
            </div>
            <div>
              <h3 className="font-bold mb-2">Features</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>AI-powered code review with best practices, bug detection, and suggestions</li>
                <li>Code explanation for any snippet</li>
                <li>History of your past reviews (session only)</li>
                <li>Supports multiple languages</li>
                <li>Dark mode toggle</li>
                <li>File upload and copy-to-clipboard</li>
                <li>Minimal, modern, responsive UI</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-2">Supported Languages</h3>
              <ul className="list-disc list-inside space-y-1">
                <li><b>JavaScript/TypeScript</b>: .js, .jsx, .ts, .tsx</li>
                <li><b>Python</b>: .py</li>
                <li><b>Java</b>: .java</li>
                <li><b>C/C++</b>: .c, .cpp, .h, .hpp</li>
                <li><b>C#</b>: .cs</li>
                <li><b>Go</b>: .go</li>
                <li><b>Rust</b>: .rs</li>
                <li><b>PHP</b>: .php</li>
                <li><b>Ruby</b>: .rb</li>
                <li><b>Swift</b>: .swift</li>
                <li><b>Kotlin</b>: .kt</li>
                <li><b>Scala</b>: .scala</li>
                <li><b>Web</b>: .html, .css</li>
                <li><b>Data</b>: .sql, .json, .xml, .yaml, .yml</li>
                <li><b>Shell</b>: .sh</li>
              </ul>
            </div>
          </div>
          <div className="text-center text-xs text-muted-foreground mt-8">
            CodeSniff by <span className="font-semibold">Shubh Soni</span> — <a href="https://shubhsoni.framer.website/" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary ml-1">Portfolio</a>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App

