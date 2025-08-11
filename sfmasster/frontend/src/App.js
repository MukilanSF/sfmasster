import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Code, Zap } from 'lucide-react';
import './App.css';
import { Navbar, ChallengeCard, ProblemList, CodeEditor, AuthModal } from './components';
import { Discuss } from './Discuss';
import { fetchApexChallenges, fetchLwcChallenges } from './supabaseClient';
import { authService } from './auth';

function App() {
  const [profileUser, setProfileUser] = useState(null);
  // Live challenge data from Supabase
  const [apexChallenges, setApexChallenges] = useState({ beginner: [], intermediate: [], master: [] });
  const [lwcChallenges, setLwcChallenges] = useState({ beginner: [], intermediate: [], master: [] });
  const [loadingChallenges, setLoadingChallenges] = useState(false);
  // Restore state from localStorage if available
  const [currentView, setCurrentView] = useState(() => {
    if (window.location.hash === '#/discuss') return 'discuss';
    return localStorage.getItem('currentView') || 'home';
  });
  const [selectedChallenge, setSelectedChallenge] = useState(() => {
    const val = localStorage.getItem('selectedChallenge');
    return val ? JSON.parse(val) : null;
  });
  const [selectedProblem, setSelectedProblem] = useState(() => {
    const val = localStorage.getItem('selectedProblem');
    return val ? JSON.parse(val) : null;
  });
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    // Fetch Apex and LWC challenges from Supabase
    setLoadingChallenges(true);
    Promise.all([
      fetchApexChallenges(),
      fetchLwcChallenges()
    ]).then(([apexData, lwcData]) => {
      // Group by difficulty
      const groupByLevel = (data) => {
        const grouped = { beginner: [], intermediate: [], master: [] };
        data.forEach((ch) => {
          if (grouped[ch.level]) grouped[ch.level].push(ch);
        });
        return grouped;
      };
      setApexChallenges(groupByLevel(apexData));
      setLwcChallenges(groupByLevel(lwcData));
      setLoadingChallenges(false);
    }).catch(() => setLoadingChallenges(false));
  }, []);

  // Persist navigation state
  useEffect(() => {
    localStorage.setItem('currentView', currentView);
    localStorage.setItem('selectedChallenge', selectedChallenge ? JSON.stringify(selectedChallenge) : '');
    localStorage.setItem('selectedProblem', selectedProblem ? JSON.stringify(selectedProblem) : '');
  }, [currentView, selectedChallenge, selectedProblem]);

  const handleSelectDifficulty = (challengeType, difficulty) => {
    console.log('Selecting challenge:', challengeType, difficulty);
    
    // Map challenge card titles to data keys
    const typeMapping = {
      'apexchallenges': 'apex',
      'lwcchallenges': 'lwc'
    };
    
    const mappedType = typeMapping[challengeType] || challengeType;
    console.log('Mapped type:', mappedType);
    
    // Use live data for Apex and LWC
    if (mappedType === 'apex' && apexChallenges[difficulty]) {
      const challengeObj = { type: mappedType, difficulty };
      setSelectedChallenge(challengeObj);
      setCurrentView('problemList');
      localStorage.setItem('selectedChallenge', JSON.stringify(challengeObj));
      localStorage.setItem('currentView', 'problemList');
    } else if (mappedType === 'lwc' && lwcChallenges[difficulty]) {
      const challengeObj = { type: mappedType, difficulty };
      setSelectedChallenge(challengeObj);
      setCurrentView('problemList');
      localStorage.setItem('selectedChallenge', JSON.stringify(challengeObj));
      localStorage.setItem('currentView', 'problemList');
    } else {
      console.error('Challenge not found:', mappedType, difficulty);
    }
  };

  const handleSelectProblem = (problem) => {
    setSelectedProblem(problem);
    setCurrentView('editor');
    localStorage.setItem('selectedProblem', JSON.stringify(problem));
    localStorage.setItem('currentView', 'editor');
  };

  const handleBack = () => {
    if (currentView === 'editor') {
      setCurrentView('problemList');
      setSelectedProblem(null);
      localStorage.setItem('currentView', 'problemList');
      localStorage.removeItem('selectedProblem');
    } else if (currentView === 'problemList') {
      setCurrentView('home');
      setSelectedChallenge(null);
      localStorage.setItem('currentView', 'home');
      localStorage.removeItem('selectedChallenge');
    } else if (currentView === 'discuss') {
      setCurrentView('home');
      window.location.hash = '';
    } else if (currentView === 'profile') {
      setCurrentView('discuss');
      setProfileUser(null);
    }
  };
  const handleProfile = (username) => {
    // In real app, fetch user by username. Here, use current user or mock.
    if (user && (user.name === username || user.email === username)) {
      setProfileUser(user);
    } else {
      setProfileUser({ name: username, avatar: '', bio: 'Salesforce developer', completedChallenges: [] });
    }
    setCurrentView('profile');
  };
  const ProfilePage = ({ profile, onBack }) => (
    <div className="min-h-screen w-full bg-gray-900 text-white flex flex-col items-center justify-center">
      <button onClick={onBack} className="absolute top-6 left-6 p-2 bg-gray-800 rounded-lg text-orange-400">Back</button>
      <div className="bg-gray-800 rounded-xl p-8 flex flex-col items-center w-full max-w-md mt-12">
        <div className="w-24 h-24 rounded-full bg-orange-500 flex items-center justify-center text-4xl text-white font-bold mb-4">
          {profile.avatar ? <img src={profile.avatar} alt={profile.name} className="w-full h-full rounded-full" /> : (profile.name ? profile.name[0].toUpperCase() : '?')}
        </div>
        <div className="text-2xl font-bold mb-2">{profile.name}</div>
        <div className="text-gray-400 mb-4">{profile.bio || 'No bio provided.'}</div>
        <div className="bg-gray-900 rounded-lg p-4 w-full">
          <div className="text-orange-400 font-semibold mb-2">Completed Challenges</div>
          <div className="text-green-400">{profile.completedChallenges?.length || 0}</div>
        </div>
      </div>
    </div>
  );

  const handleSignIn = () => {
    setShowAuthModal(true);
  };

  const handleSignOut = () => {
    authService.logout();
    setUser(null);
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
  };

  const handleChallengeCompleted = (challengeId) => {
    // Update user's completed challenges and auto-load next challenge if available
    if (user && selectedChallenge) {
      const updatedCompleted = [...user.completedChallenges, challengeId];
      let allChallenges = [];
      if (selectedChallenge.type === 'apex') {
        allChallenges = apexChallenges[selectedChallenge.difficulty] || [];
      } else {
        allChallenges = mockChallenges[selectedChallenge.type][selectedChallenge.difficulty];
      }
      // Find next unattempted challenge
      const nextChallenge = allChallenges.find(
        (ch) => !updatedCompleted.includes(ch.id)
      );
      const updatedUser = {
        ...user,
        completedChallenges: updatedCompleted
      };
      setUser(updatedUser);
      if (nextChallenge) {
        // Auto-load next challenge
        setSelectedProblem(nextChallenge);
        setCurrentView('editor');
        localStorage.setItem('selectedProblem', JSON.stringify(nextChallenge));
        localStorage.setItem('currentView', 'editor');
      } else {
        // All challenges completed in this difficulty
        setTimeout(() => {
          alert("Let's become a Master! You've completed all challenges in this level. Choose the next difficulty.");
          setCurrentView('home');
          setSelectedChallenge(null);
          setSelectedProblem(null);
          localStorage.setItem('currentView', 'home');
          localStorage.removeItem('selectedChallenge');
          localStorage.removeItem('selectedProblem');
        }, 500);
      }
    }
  };

  const getTotalChallenges = () => {
    // Only count Apex for now (live data)
    return ['beginner', 'intermediate', 'master'].reduce((total, level) => total + (apexChallenges[level]?.length || 0), 0);
  };

  const getCompletedChallenges = () => {
    return user ? user.completedChallenges.length : 0;
  };

  const HomePage = () => (
    <div className="min-h-screen bg-gray-900">
      <Navbar 
        user={user} 
        onSignIn={handleSignIn} 
        onSignOut={handleSignOut} 
      />

      {/* Challenge Cards at the Top */}
      <div className="max-w-4xl mx-auto pt-12 pb-8 px-6">
        <div className="grid md:grid-cols-2 gap-8">
          <ChallengeCard
            title="Apex Challenges"
            icon={Code}
            description="Master Salesforce backend development with Apex programming challenges"
            onSelectDifficulty={handleSelectDifficulty}
            difficulties={['beginner', 'intermediate', 'master'].map(level => ({
              name: level.charAt(0).toUpperCase() + level.slice(1),
              count: apexChallenges[level]?.length || 0,
              color: level === 'beginner' ? 'text-green-500' : level === 'intermediate' ? 'text-yellow-500' : 'text-red-500',
              bg: level === 'beginner' ? 'bg-green-900/30' : level === 'intermediate' ? 'bg-yellow-900/30' : 'bg-red-900/30'
            }))}
          />
          <ChallengeCard
            title="LWC Challenges"
            icon={Zap}
            description="Build modern Lightning Web Components with JavaScript, HTML, and CSS"
            onSelectDifficulty={handleSelectDifficulty}
            difficulties={['beginner', 'intermediate', 'master'].map(level => ({
              name: level.charAt(0).toUpperCase() + level.slice(1),
              count: lwcChallenges[level]?.length || 0,
              color: level === 'beginner' ? 'text-blue-500' : level === 'intermediate' ? 'text-yellow-500' : 'text-red-500',
              bg: level === 'beginner' ? 'bg-blue-900/30' : level === 'intermediate' ? 'bg-yellow-900/30' : 'bg-red-900/30'
            }))}
          />
        </div>
      </div>

      {/* Hero Section and Features Below */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Master Salesforce development with hands-on coding challenges. 
            Practice Apex and Lightning Web Components with real-world scenarios.
          </p>
          <div className="flex justify-center space-x-4">
            <div className="bg-gray-800 px-6 py-3 rounded-lg border border-gray-700">
              <span className="text-gray-400">Total Challenges: </span>
              <span className="text-orange-500 font-semibold">{getTotalChallenges()}</span>
            </div>
            <div className="bg-gray-800 px-6 py-3 rounded-lg border border-gray-700">
              <span className="text-gray-400">Completed: </span>
              <span className="text-green-500 font-semibold">{getCompletedChallenges()}</span>
            </div>
            <div className="bg-gray-800 px-6 py-3 rounded-lg border border-gray-700">
              <span className="text-gray-400">Active Users: </span>
              <span className="text-orange-500 font-semibold">{authService.getActiveUsersCount().toLocaleString()}+</span>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Code className="text-green-500" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Real-time Code Editor</h3>
            <p className="text-gray-400">
              Monaco-based editor with syntax highlighting, auto-completion, and error detection
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="text-orange-500" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Instant Feedback</h3>
            <p className="text-gray-400">
              Run and debug your code instantly with comprehensive test cases and detailed results
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Code className="text-blue-500" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Progressive Learning</h3>
            <p className="text-gray-400">
              Start with beginner challenges and advance to master-level Salesforce development
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Listen for hash change to support Discuss navigation
  useEffect(() => {
    const onHashChange = () => {
      if (window.location.hash === '#/discuss') setCurrentView('discuss');
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return (
    <div className="App bg-gray-900 min-h-screen">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <AnimatePresence mode="wait">
              {currentView === 'home' && <HomePage key="home" />}
              {currentView === 'problemList' && selectedChallenge && (
                <div key="problemList" className="min-h-screen bg-gray-900 p-6">
                  <ProblemList
                    challengeType={selectedChallenge.type}
                    difficulty={selectedChallenge.difficulty}
                    onSelectProblem={handleSelectProblem}
                    onBack={handleBack}
                    user={user}
                    apexChallenges={apexChallenges}
                    lwcChallenges={lwcChallenges}
                  />
                </div>
              )}
              {currentView === 'editor' && selectedProblem && (
                <CodeEditor
                  key="editor"
                  problem={selectedProblem}
                  onBack={handleBack}
                  user={user}
                  onChallengeCompleted={handleChallengeCompleted}
                />
              )}
              {currentView === 'discuss' && (
                <Discuss onBack={handleBack} user={user} onProfile={handleProfile} />
              )}
              {currentView === 'profile' && profileUser && (
                <ProfilePage profile={profileUser} onBack={handleBack} />
              )}
            </AnimatePresence>
          } />
        </Routes>
      </BrowserRouter>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}

export default App;