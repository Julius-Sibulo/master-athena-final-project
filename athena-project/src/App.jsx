import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AiTutor from './pages/AiTutor';
import DashboardHome from './pages/DashboardHome';
import Settings from './pages/Settings'; 
import MyLessons from './pages/MyLessons'; 
import Quizzes from './pages/Quizzes'; 
import Progress from './pages/Progress';
import { Spinner } from 'react-bootstrap'; 

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("athenaUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [conversations, setConversations] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    if (currentUser?.id) {
      setIsDataLoading(true); 

      Promise.all([
        fetch(`https://master-athena-final-project.onrender.com/api/lessons/?user_id=${currentUser.id}`).then(res => res.json()),
        fetch(`https://master-athena-final-project.onrender.com/api/quizzes/?user_id=${currentUser.id}`).then(res => res.json()),
        fetch(`https://master-athena-final-project.onrender.com/api/conversations/?user_id=${currentUser.id}`).then(res => res.json())
      ])
      .then(([lessonsData, quizzesData, convosData]) => {
        setLessons(lessonsData);
        setQuizzes(quizzesData);

        const safeConvos = convosData.map(c => {
            let displayTime = "Just now";
            if (c.time) {
                displayTime = c.time; 
            } else if (c.created_at) {
                const dateObj = new Date(c.created_at);
                if (!isNaN(dateObj)) { 
                    displayTime = dateObj.toLocaleDateString();
                }
            }
            return {
                ...c,
                subject: c.subject || 'General',
                time: displayTime,
                messages: c.messages || [] 
            };
        });
        
        setConversations(safeConvos);
      })
      .catch(err => console.error("Error fetching user data:", err))
      .finally(() => {
        setIsDataLoading(false); 
      });

    } else {
      setIsDataLoading(false); 
    }
  }, [currentUser?.id]); 

  // --- NEW: ADVANCED QUIZ RECORDING ---
  const markQuizCompleted = async (quizId, finalScore) => {
    // 1. Instantly update the UI so the card shows the score
    setQuizzes(prev => prev.map(quiz => 
      quiz.id === quizId ? { ...quiz, status: 'Completed', lastScore: finalScore } : quiz
    ));

    // 2. Tell Django to record the activity and update the streak!
    try {
      const res = await fetch('https://master-athena-final-project.onrender.com/api/complete-quiz/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: currentUser.id, quiz_id: quizId, score: finalScore })
      });
      const data = await res.json();
      if (data.streak) {
        updateUser({ streak: data.streak });
      }
    } catch (err) { console.error("Failed to record score:", err); }
  };

  const addConversation = (newChat) => setConversations(prev => [newChat, ...prev]);
  
  const addMessageToChat = (chatId, newMessage) => {
    setConversations(prev => prev.map(chat => 
      chat.id === chatId ? { ...chat, messages: [...(chat.messages || []), newMessage] } : chat
    ));
  };
  
  const deleteConversation = async (idToDelete) => {
    setConversations(prev => prev.filter(c => c.id !== idToDelete));
    try {
      await fetch(`https://master-athena-final-project.onrender.com/api/conversations/${idToDelete}/`, { method: 'DELETE' });
    } catch (error) { console.error("Error deleting conversation:", error); }
  };

  const deleteLesson = async (idToDelete) => {
    setLessons(prev => prev.filter(l => l.id !== idToDelete));
    try {
      await fetch(`https://master-athena-final-project.onrender.com/api/lessons/${idToDelete}/`, { method: 'DELETE' });
    } catch (error) { console.error("Error deleting lesson:", error); }
  };

  const deleteQuiz = async (idToDelete) => {
    setQuizzes(prev => prev.filter(q => q.id !== idToDelete));
    try {
      await fetch(`https://master-athena-final-project.onrender.com/api/quizzes/${idToDelete}/`, { method: 'DELETE' });
    } catch (error) { console.error("Error deleting quiz:", error); }
  };

  const generateStandaloneLesson = async (topic) => {
    try {
      const res = await fetch('https://master-athena-final-project.onrender.com/api/generate-lesson/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, user_id: currentUser.id })
      });
      const data = await res.json();
      if (data.lesson) {
        setLessons(prev => [data.lesson, ...prev]);
        if (data.streak) updateUser({ streak: data.streak });
      }
    } catch (err) { console.error(err); }
  };

  const generateStandaloneQuiz = async (topic, numQuestions = 5, difficulty = 'Medium') => {
    try {
      const res = await fetch('https://master-athena-final-project.onrender.com/api/generate-quiz/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, user_id: currentUser.id, num_questions: numQuestions, difficulty })
      });
      const data = await res.json();
      if (data.id) setQuizzes(prev => [data, ...prev]);
    } catch (err) { console.error(err); }
  };

  const generateContentFromDocument = async (fileInput, numQuestions = 5) => {
    const fileName = typeof fileInput === 'string' ? fileInput : fileInput?.name;
    if (!fileName) return;
    const cleanName = fileName.replace(/\.[^/.]+$/, ""); 
    
    try {
      const [lessonRes, quizRes] = await Promise.all([
        fetch('https://master-athena-final-project.onrender.com/api/generate-lesson/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic: cleanName, user_id: currentUser.id })
        }),
        fetch('https://master-athena-final-project.onrender.com/api/generate-quiz/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic: cleanName, user_id: currentUser.id, num_questions: numQuestions })
        })
      ]);

      const lessonData = await lessonRes.json();
      const quizData = await quizRes.json();

      if (lessonData.lesson) setLessons(prev => [lessonData.lesson, ...prev]);
      if (quizData.id) setQuizzes(prev => [quizData, ...prev]);
      
      if (lessonData.streak) updateUser({ streak: lessonData.streak });
    } catch (error) { console.error("Error generating content:", error); }
  };

  const handleLogin = async (username, password) => {
    try {
      const response = await fetch('https://master-athena-final-project.onrender.com/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (response.ok) {
        const userObj = { 
          id: data.id, name: data.name, username: data.username, 
          email: data.email, bio: data.bio, streak: data.streak, 
          avatar: data.avatar || null, role: 'Student Account'
        };
        setCurrentUser(userObj);
        localStorage.setItem("athenaUser", JSON.stringify(userObj));
        return true; 
      }
      return false; 
    } catch (error) { return false; }
  };

  const updateUser = (updatedData) => {
    setCurrentUser(prev => {
      const newUser = { ...prev, ...updatedData };
      localStorage.setItem("athenaUser", JSON.stringify(newUser)); 
      return newUser;
    });
  };
  
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("athenaUser"); 
  };

  if (isDataLoading) {
    return (
      <div className="vh-100 d-flex flex-column justify-content-center align-items-center bg-light">
        <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
        <h5 className="mt-3 text-muted fw-bold">Loading Athena...</h5>
      </div>
    );
  }

  return (
    <Router basename="/athena-project">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={
          currentUser ? (
            <Dashboard 
              currentUser={currentUser} updateUser={updateUser} 
              conversations={conversations} lessons={lessons} quizzes={quizzes}         
              generateContentFromDocument={generateContentFromDocument} 
              generateStandaloneLesson={generateStandaloneLesson}
              generateStandaloneQuiz={generateStandaloneQuiz}
              addConversation={addConversation} deleteConversation={deleteConversation}
              deleteLesson={deleteLesson} deleteQuiz={deleteQuiz}      
              addMessageToChat={addMessageToChat} 
              markQuizCompleted={markQuizCompleted} /* <-- Passing it down! */
              onLogout={handleLogout} 
            />
          ) : ( <Navigate to="/" /> )
        }>
           <Route index element={<Navigate to="home" replace />} />
           <Route path="home" element={<DashboardHome />} />
           <Route path="ai-tutor" element={<AiTutor />} />
           <Route path="lessons" element={<MyLessons />} />
           <Route path="quizzes" element={<Quizzes />} />
           <Route path="progress" element={<Progress />} />
           <Route path="settings" element={<Settings />} /> 
        </Route>
      </Routes>
    </Router>
  );
}

export default App;