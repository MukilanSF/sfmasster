import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code, 
  Terminal, 
  Play, 
  Bug, 
  RotateCcw, 
  CheckCircle, 
  XCircle, 
  Trophy, 
  Star,
  ArrowLeft,
  Lightbulb,
  FileText,
  Zap,
  Users,
  LogIn,
  LogOut,
  User,
  X,
  Eye,
  EyeOff,
  Sparkles,
  Target,
  Award
} from 'lucide-react';
import Editor from '@monaco-editor/react';
import confetti from 'confetti-js';
// Removed mockChallenges and related mock data imports
import { authService } from './auth';

// Authentication Modal Component
export const AuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      let result;
      if (isLogin) {
        result = await authService.login(formData.email, formData.password);
      } else {
        result = await authService.signup(formData.email, formData.password, formData.name);
      }

      if (result.success) {
        onAuthSuccess(result.user);
        onClose();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Authentication failed. Please try again.');
    }

    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gray-800 p-6 rounded-xl border border-gray-700 w-full max-w-md"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-orange-500 focus:outline-none"
                required={!isLogin}
              />
            </div>
          )}

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-orange-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-orange-500 focus:outline-none"
              required
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-orange-500 hover:text-orange-400 transition-colors"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Navbar Component
export const Navbar = ({ user, onSignIn, onSignOut }) => {
  const [activeUsersCount, setActiveUsersCount] = useState(2500);

  useEffect(() => {
    // Update active users count every 30 seconds
    const interval = setInterval(() => {
      setActiveUsersCount(authService.getActiveUsersCount());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleDiscuss = () => {
    window.location.hash = '#/discuss';
  };
  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Zap className="text-orange-500" size={28} />
            <span className="text-xl font-bold text-white">SFMasster</span>
          </div>
          <span className="text-gray-400 text-sm">Salesforce Training Platform</span>
        </div>
        <div className="flex items-center space-x-6">
          {/* Removed Contest button */}
          <button className="text-gray-300 hover:text-white transition-colors" onClick={handleDiscuss}>Discuss</button>
          <div className="flex items-center space-x-2 text-gray-400 text-sm">
            <Users size={16} />
            <span>{activeUsersCount.toLocaleString()} active</span>
          </div>
          {user ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-white">{user.name}</span>
              </div>
              <button
                onClick={onSignOut}
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onSignIn}
              className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <LogIn size={16} />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

// Challenge Card Component
export const ChallengeCard = ({ title, icon: Icon, description, onSelectDifficulty, difficulties }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-orange-500/50 transition-all duration-300"
    >
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-3 bg-orange-500/10 rounded-lg">
          <Icon className="text-orange-500" size={24} />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <p className="text-gray-400 text-sm">{description}</p>
        </div>
      </div>
      <div className="space-y-3">
        {difficulties.map((difficulty) => (
          <button
            key={difficulty.name}
            onClick={() => onSelectDifficulty(
              title.toLowerCase().includes('apex') ? 'apexchallenges' : 'lwcchallenges',
              difficulty.name.toLowerCase()
            )}
            className={`w-full p-4 rounded-lg border border-gray-600 ${difficulty.bg} transition-all duration-200 group`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${difficulty.color.replace('text-', 'bg-')}`} />
                <span className="text-white font-medium">{difficulty.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">{difficulty.count} problems</span>
                <Trophy className={`${difficulty.color} group-hover:scale-110 transition-transform`} size={16} />
              </div>
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

// Problem List Component
export const ProblemList = ({ challengeType, difficulty, onSelectProblem, onBack, user, apexChallenges, lwcChallenges }) => {
  let problems = [];
  if (challengeType === 'apex' && apexChallenges) {
    problems = apexChallenges[difficulty] || [];
  } else if (challengeType === 'lwc' && lwcChallenges) {
    problems = lwcChallenges[difficulty] || [];
  }
  // Sort by order: 1-25, 26-50, 51-75, then by id/order field if present
  problems = problems
    .slice() // copy
    .sort((a, b) => {
      // If explicit order field exists, use it; else fallback to id
      const getOrder = (p) => p.order || p.id || 0;
      return getOrder(a) - getOrder(b);
    });
  const completedChallenges = user ? user.completedChallenges : [];
  
  const getDifficultyColor = (level) => {
    switch(level) {
      case 'beginner': return 'text-green-500';
      case 'intermediate': return 'text-yellow-500';
      case 'master': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const isCompleted = (problemId) => {
    return completedChallenges.includes(problemId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-6xl mx-auto"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="text-gray-400" size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-white capitalize">
              {challengeType} Challenges - {difficulty}
            </h2>
            <p className="text-gray-400">{problems.length} problems available</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="grid grid-cols-11 gap-4 p-4 bg-gray-900 border-b border-gray-700 text-gray-400 text-sm font-medium">
          <div className="col-span-6">Title</div>
          <div className="col-span-2">Difficulty</div>
          <div className="col-span-2">Acceptance</div>
          <div className="col-span-1">Status</div>
        </div>
        
        {problems.map((problem, index) => (
          <motion.div
            key={problem.id}
            whileHover={{ backgroundColor: 'rgba(75, 85, 99, 0.3)' }}
            onClick={() => onSelectProblem(problem)}
            className="grid grid-cols-11 gap-4 p-4 border-b border-gray-700 last:border-b-0 cursor-pointer transition-colors"
          >
            <div className="col-span-6 flex items-center">
              <span className="text-white hover:text-orange-500 transition-colors">
                {index + 1}. {problem.title}
              </span>
            </div>
            <div className="col-span-2 flex items-center">
              <span className={`${getDifficultyColor(problem.level)} capitalize font-medium`}>
                {problem.level}
              </span>
            </div>
            <div className="col-span-2 flex items-center">
              <span className="text-gray-400">
                {Math.floor(Math.random() * 30) + 50}%
              </span>
            </div>
            <div className="col-span-1 flex items-center">
              {isCompleted(problem.id) ? (
                <CheckCircle size={20} className="text-green-500" />
              ) : (
                <div className="w-4 h-4 rounded border-2 border-gray-600"></div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Code Editor Component
export const CodeEditor = ({ problem, onBack, user, onChallengeCompleted }) => {
  // Utility to convert \n to real newlines
  const convertNewlines = (str) => typeof str === 'string' ? str.replace(/\\n/g, '\n') : str;

  // For LWC, convert newlines in all files; for Apex, just the string
  const getStarterCode = () => {
    if (typeof problem.starterCode === 'object') {
      return {
        html: convertNewlines(problem.starterCode.html || ''),
        js: convertNewlines(problem.starterCode.js || ''),
        css: convertNewlines(problem.starterCode.css || ''),
        xml: convertNewlines(problem.starterCode.xml || '')
      };
    }
    return convertNewlines(problem.starterCode);
  };

  const [code, setCode] = useState(
    typeof problem.starterCode === 'object'
      ? convertNewlines(problem.starterCode.js || '')
      : convertNewlines(problem.starterCode)
  );
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [currentQuote, setCurrentQuote] = useState('');
  const [testResults, setTestResults] = useState(null);
  const [codeStatus, setCodeStatus] = useState('idle'); // idle, success, error, almost
  
  // Show html, js, and css tabs for LWC challenges
  const LWC_FILE_TYPES = ['html', 'js', 'css'];
  const [lwcFiles, setLwcFiles] = useState(() => {
    if (typeof problem.starterCode === 'object') {
      // Only keep html, js, and css
      return {
        html: getStarterCode().html,
        js: getStarterCode().js,
        css: getStarterCode().css
      };
    }
    return null;
  });
  const [currentLwcFile, setCurrentLwcFile] = useState('js');

  // Set random motivational quote on component mount
  useEffect(() => {
    const quotes = [
      'Keep pushing forward!',
      'Every challenge is an opportunity to grow.',
      'You are mastering Salesforce, one problem at a time!',
      'Persistence is the key to success.',
      'Great things never come from comfort zones.'
    ];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setCurrentQuote(randomQuote);
  }, []);

  useEffect(() => {
    if (typeof problem.starterCode === 'object') {
      setLwcFiles({
        html: getStarterCode().html,
        js: getStarterCode().js,
        css: getStarterCode().css
      });
      setCode(convertNewlines(problem.starterCode.js || ''));
      setCurrentLwcFile('js');
    } else {
      setLwcFiles(null);
      setCode(convertNewlines(problem.starterCode));
    }
  }, [problem]);

  // Evaluate Apex code (simulate or call backend)
  const handleRun = async () => {
    setIsRunning(true);
    setOutput('Running code...\n');
    setTestResults(null);
    try {
      // Example: Call backend API to evaluate Apex code
      const response = await fetch('http://localhost:5000/evaluate-apex', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      const result = await response.json();
      if (result.success) {
        setOutput(result.output || '✅ Code executed successfully.');
        setCodeStatus('success');
        setTestResults(result.testResults || { passed: result.passed || 0, total: result.total || 0, success: true });
      } else {
        setOutput(result.error || '❌ Compilation or runtime error.');
        setCodeStatus('error');
        setTestResults({ passed: 0, total: 0, success: false });
      }
    } catch (err) {
      setOutput('❌ Error: ' + (err.message || 'Failed to evaluate code.'));
      setCodeStatus('error');
      setTestResults({ passed: 0, total: 0, success: false });
    }
    setIsRunning(false);
  };

  const generateMockError = () => {
    const errors = [
      'Unexpected token \';\'',
      'Variable \'result\' might not have been initialized',
      'Missing return statement',
      'Method does not exist on type String',
      'List index out of bounds'
    ];
    return errors[Math.floor(Math.random() * errors.length)];
  };

  // Preview handler for LWC
  const handlePreview = async () => {
    setIsRunning(true);
    setOutput('Preparing preview...');
    try {
      // Only for LWC challenges
      if (lwcFiles) {
        const html = lwcFiles.html || '';
        const js = lwcFiles.js || code;
        const css = lwcFiles.css || '';
        await fetch('http://localhost:3001/preview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ html, js, css })
        });
        setOutput('Opening preview in browser...');
        window.open('http://localhost:3001', '_blank');
      } else {
        setOutput('Preview is only available for LWC challenges.');
      }
    } catch (err) {
      setOutput('Failed to open preview. Is the preview server running?');
    }
    setIsRunning(false);
  };

  const generateMockOutput = () => {
    const outputs = [
      'All test cases passed!\n\nTest case 1: ✅ Basic functionality\nTest case 2: ✅ Edge cases\nTest case 3: ✅ Performance test',
      'Perfect execution!\n\nResult: [0, 1]\nExpected: [0, 1]\nAll assertions passed!',
      'Excellent work!\n\nFunction executed with input: [1, 2, 3, 4, 5]\nReturned: 15\nCorrect!',
      'Outstanding!\n\nString processed: "hello world"\nResult: "HELLO WORLD"\nTransformation successful!'
    ];
    return outputs[Math.floor(Math.random() * outputs.length)];
  };

  const handleRetry = async () => {
    if (lwcFiles) {
      setLwcFiles({
        html: getStarterCode().html,
        js: getStarterCode().js,
        css: getStarterCode().css
      });
      setCode(getStarterCode()[currentLwcFile] || '');
    } else {
      setCode(getStarterCode());
    }
    setOutput('');
    setTestResults(null);
    setCodeStatus('idle');
    // Set new motivational quote
    const quotes = [
      'Keep pushing forward!',
      'Every challenge is an opportunity to grow.',
      'You are mastering Salesforce, one problem at a time!',
      'Persistence is the key to success.',
      'Great things never come from comfort zones.'
    ];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setCurrentQuote(randomQuote);
    // For Apex, rerun code after retry
    if (!lwcFiles) {
      await handleRun();
    }
  };

  const handleLwcFileChange = (fileType) => {
    if (lwcFiles) {
      setCurrentLwcFile(fileType);
      setCode(lwcFiles[fileType] || '');
    }
  };

  const handleCodeChange = (value) => {
    setCode(value);
    if (lwcFiles) {
      setLwcFiles(prev => ({
        ...prev,
        [currentLwcFile]: value
      }));
    }
    // Reset status when code changes
    if (codeStatus !== 'idle') {
      setCodeStatus('idle');
    }
  };

  const handleChallengeSuccess = () => {
    if (user && onChallengeCompleted) {
      authService.markChallengeCompleted(problem.id);
      onChallengeCompleted(problem.id);

      // Trigger confetti animation
      const confettiSettings = {
        target: 'confetti-canvas',
        max: 100,
        size: 1,
        animate: true,
        props: ['circle', 'square', 'triangle', 'line'],
        colors: [[255, 140, 0], [255, 165, 0], [255, 215, 0], [34, 197, 94]],
        clock: 25,
        rotate: true,
        width: window.innerWidth,
        height: window.innerHeight,
        start_from_edge: true,
        respawn: false
      };

      const confettiInstance = new confetti(confettiSettings);
      confettiInstance.render();

      setTimeout(() => {
        confettiInstance.clear();
      }, 3000);

      // Auto-load next challenge after marking complete
      if (window && window.loadNextChallenge) {
        window.loadNextChallenge(problem.id);
      }
    }
  };

  const getEditorBorderClass = () => {
    switch(codeStatus) {
      case 'success': return 'border-green-500 shadow-green-500/50';
      case 'error': return 'border-red-500 shadow-red-500/50';
      case 'almost': return 'border-yellow-500 shadow-yellow-500/50';
      default: return 'border-gray-700';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-screen bg-gray-900 flex flex-col"
    >
      {/* Canvas for confetti */}
      <canvas id="confetti-canvas" className="fixed inset-0 pointer-events-none z-50"></canvas>
      
      {/* Motivational Quote Bar */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 text-center">
        <div className="flex items-center justify-center space-x-2">
          <Sparkles size={16} />
          <span className="font-medium">{currentQuote}</span>
          <Sparkles size={16} />
        </div>
      </div>
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
          >
            <ArrowLeft className="text-gray-400" size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">{problem.title}</h1>
            <span className={`text-sm capitalize ${
              problem.level === 'beginner' ? 'text-green-500' :
              problem.level === 'intermediate' ? 'text-yellow-500' : 'text-red-500'
            }`}>
              {problem.level}
            </span>
          </div>
          
          {/* Test Results Badge */}
          {testResults && (
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              testResults.success 
                ? 'bg-green-500/20 text-green-400' 
                : testResults.passed > 0 
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : 'bg-red-500/20 text-red-400'
            }`}>
              {testResults.passed}/{testResults.total} tests passed
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          {/* For Apex: Run/Retry, For LWC: Preview/Retry */}
          {!lwcFiles ? (
            <>
              <button
                onClick={handleRun}
                disabled={isRunning}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play size={16} />
                <span>{isRunning ? 'Running...' : 'Run'}</span>
              </button>
              <button
                onClick={handleRetry}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <RotateCcw size={16} />
                <span>Retry</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handlePreview}
                disabled={isRunning}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Eye size={16} />
                <span>Preview</span>
              </button>
              <button
                onClick={handleRetry}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <RotateCcw size={16} />
                <span>Retry</span>
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Problem Description */}
        <div className="w-1/2 bg-gray-900 border-r border-gray-700 overflow-y-auto">
          <div className="p-6">
            <div className="flex border-b border-gray-700 mb-6">
              <button
                onClick={() => setActiveTab('description')}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === 'description' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-400 hover:text-white'
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab('hints')}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === 'hints' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-400 hover:text-white'
                }`}
              >
                Hints
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Problem Description</h3>
                <p className="text-gray-300 leading-relaxed">{problem.description}</p>
              </div>

              {activeTab === 'hints' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4"
                >
                  <h4 className="text-yellow-500 font-semibold mb-2 flex items-center">
                    <Lightbulb size={16} className="mr-2" />
                    Hints
                  </h4>
                  <ul className="space-y-2">
                    {problem.hints.map((hint, index) => (
                      <li key={index} className="text-gray-300 text-sm">
                        {index + 1}. {hint}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              <div>
                <h4 className="text-white font-semibold mb-2 flex items-center">
                  <FileText size={16} className="mr-2" />
                  Test Cases
                </h4>
                <pre className="bg-gray-800 p-4 rounded-lg text-sm text-gray-300 overflow-x-auto">
                  {convertNewlines(problem.testCode)}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="w-1/2 flex flex-col">
          {/* LWC File Tabs */}
          {lwcFiles && (
            <div className="flex bg-gray-800 border-b border-gray-700 px-4">
              {LWC_FILE_TYPES.map((fileType) => (
                <button
                  key={fileType}
                  onClick={() => handleLwcFileChange(fileType)}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    currentLwcFile === fileType 
                      ? 'text-orange-500 bg-gray-700 border-b-2 border-orange-500' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {fileType.toUpperCase()}
                </button>
              ))}
            </div>
          )}

          {/* Code Editor */}
          <div className={`flex-1 border-2 transition-all duration-300 ${getEditorBorderClass()}`}>
            <Editor
              height="100%"
              defaultLanguage={
                lwcFiles
                  ? currentLwcFile === 'js'
                    ? 'javascript'
                    : currentLwcFile === 'html'
                    ? 'html'
                    : currentLwcFile === 'css'
                    ? 'css'
                    : currentLwcFile === 'xml'
                    ? 'xml'
                    : 'plaintext'
                  : 'apex'
              }
              theme="vs-dark"
              value={code}
              onChange={handleCodeChange}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 4,
                wordWrap: 'on',
                folding: true,
                lineDecorationsWidth: 0,
                lineNumbersMinChars: 3,
                renderLineHighlight: 'all',
                cursorBlinking: 'smooth',
                smoothScrolling: true
              }}
            />
          </div>

          {/* Output Panel */}
          <div className="h-48 bg-gray-800 border-t border-gray-700 p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Terminal size={16} className="text-gray-400" />
                <span className="text-gray-400 font-medium">Console</span>
                {codeStatus === 'success' && (
                  <div className="flex items-center space-x-1 text-green-500">
                    <CheckCircle size={16} />
                    <span className="text-sm">Success!</span>
                  </div>
                )}
                {codeStatus === 'error' && (
                  <div className="flex items-center space-x-1 text-red-500">
                    <XCircle size={16} />
                    <span className="text-sm">Error</span>
                  </div>
                )}
                {codeStatus === 'almost' && (
                  <div className="flex items-center space-x-1 text-yellow-500">
                    <Star size={16} />
                    <span className="text-sm">Almost There!</span>
                  </div>
                )}
              </div>
              
              <button
                onClick={async () => {
                  // Always run code first
                  setIsRunning(true);
                  setOutput('Running code...\n');
                  setTestResults(null);
                  await new Promise(resolve => setTimeout(resolve, 1500));
                  // Simulate code execution (same as handleRun)
                  const random = Math.random();
                  const success = random > 0.3;
                  const almostThere = random > 0.15 && random <= 0.3;
                  if (success) {
                    const successMsgs = [
                      'Great job!',
                      'Well done!',
                      'You nailed it!',
                      'Excellent work!'
                    ];
                    const successMsg = successMsgs[Math.floor(Math.random() * successMsgs.length)];
                    setOutput(`✅ ${successMsg}\n\n${generateMockOutput()}\n\nExecution time: ${Math.floor(Math.random() * 100) + 20}ms\nMemory usage: ${Math.floor(Math.random() * 50) + 10}MB`);
                    setCodeStatus('success');
                    setTestResults({ passed: Math.floor(Math.random() * 3) + 3, total: Math.floor(Math.random() * 3) + 3, success: true });
                    setIsRunning(false);
                    handleChallengeSuccess();
                  } else {
                    const failureMsgs = [
                      'Try again! You can do it.',
                      'Check your code and try once more.',
                      'Don’t give up! Review the error and retry.'
                    ];
                    const failureMsg = failureMsgs[Math.floor(Math.random() * failureMsgs.length)];
                    setOutput(`❌ ${failureMsg}\n\nCompilation Error:\nLine ${Math.floor(Math.random() * 10) + 1}: ${generateMockError()}\n\nPlease check your syntax and try again.`);
                    setCodeStatus('error');
                    setTestResults({ passed: 0, total: 3, success: false });
                    setIsRunning(false);
                    alert('Please complete the challenge before attempting to "Mark Complete"');
                  }
                }}
                className={`flex items-center space-x-2 px-3 py-1 rounded text-sm transition-colors ${codeStatus === 'success' ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-600 text-white hover:bg-gray-700'}`}
                disabled={isRunning}
              >
                <Trophy size={14} />
                Mark Complete
              </button>
            </div>
            
            <pre className={`text-sm whitespace-pre-wrap ${
              codeStatus === 'success' ? 'text-green-300' :
              codeStatus === 'error' ? 'text-red-300' :
              codeStatus === 'almost' ? 'text-yellow-300' :
              'text-gray-300'
            }`}>{output || 'Click "Run" to execute your code and see the results here...'}</pre>
          </div>
        </div>
      </div>
    </motion.div>
  );
};