import React, { useState, useEffect, useRef } from 'react';
import './App.css'

function App() {
  const [status, setStatus] = useState('LOCKED IN');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [score, setScore] = useState(0);
  const timerRef = useRef(null);

  const getRandomTime = () => Math.floor(Math.random() * 26) + 5; // 5-30 minutes (in minutes)

  const startNewRound = () => {
    const newTime = getRandomTime() * 60; // Convert minutes to seconds
    setTimeLeft(newTime);
    setStatus('LOCKED IN');
    setIsActive(true);
  };

  const handleButtonClick = () => {
    if (status === 'LOCKED IN' && isActive) {
      setScore(prev => prev + 1);
      setIsActive(false);
      clearInterval(timerRef.current);
      
      // Brief pause before next round
      setTimeout(() => {
        startNewRound();
      }, 1000);
    } else if (status === 'SILLY') {
      // Reset game
      setScore(0);
      startNewRound();
    }
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setStatus('SILLY');
            setIsActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft]);

  useEffect(() => {
    // Start first round
    startNewRound();
    
    return () => clearInterval(timerRef.current);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = () => {
    if (status === 'LOCKED IN') {
      return timeLeft <= 60 ? 'text-red-500' : 'text-green-500'; // Red when under 1 minute
    }
    return 'text-red-500';
  };

  const getBackgroundColor = () => {
    if (status === 'SILLY') return 'bg-red-100';
    if (timeLeft <= 60) return 'bg-yellow-100'; // Warning when under 1 minute
    return 'bg-green-100';
  };

  const getButtonColor = () => {
    if (status === 'SILLY') return 'bg-red-500 hover:bg-red-600';
    if (timeLeft <= 60) return 'bg-red-500 hover:bg-red-600'; // Red when under 1 minute
    return 'bg-blue-500 hover:bg-blue-600';
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-300 ${getBackgroundColor()}`}>
      <div className="text-center p-8 max-w-md mx-auto">
        {/* Score */}
        <div className="mb-6">
          <span className="text-sm font-medium text-gray-600">Score: </span>
          <span className="text-lg font-bold text-gray-800">{score}</span>
        </div>

        {/* Status Display */}
        <div className="mb-8">
          <h1 className={`text-6xl font-black mb-4 transition-colors duration-300 ${getStatusColor()}`}>
            {status}
          </h1>
          
          {status === 'LOCKED IN' && (
            <div className="mb-6">
              <div className={`text-4xl font-bold mb-2 ${timeLeft <= 60 ? 'text-red-500 animate-pulse' : 'text-gray-700'}`}>
                {formatTime(timeLeft)}
              </div>
              <div className="w-full bg-gray-300 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-1000 ${
                    timeLeft <= 60 ? 'bg-red-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${(timeLeft / (30 * 60)) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={handleButtonClick}
          className={`px-8 py-4 text-white font-bold text-xl rounded-lg shadow-lg transform transition-all duration-150 hover:scale-105 active:scale-95 ${getButtonColor()}`}
        >
          {status === 'SILLY' ? 'TRY AGAIN' : 'STAY LOCKED IN!'}
        </button>

        {/* Instructions */}
        <div className="mt-8 text-sm text-gray-600 max-w-xs mx-auto">
          {status === 'SILLY' ? (
            <p>You got silly! Click to restart and try to stay locked in.</p>
          ) : (
            <p>Click the button before time runs out to stay locked in! Each round has a random timer.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App
