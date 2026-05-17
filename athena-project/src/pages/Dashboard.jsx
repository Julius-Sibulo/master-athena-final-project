import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const Dashboard = ({ 
  currentUser, 
  updateUser, 
  conversations, 
  lessons, 
  quizzes, 
  generateContentFromDocument, 
  generateStandaloneLesson, 
  generateStandaloneQuiz,   
  addConversation, 
  deleteConversation, 
  deleteLesson,      
  deleteQuiz,       
  addMessageToChat, 
  markQuizCompleted, 
  onLogout 
}) => {
  
  const handleSignOut = () => onLogout(); 

  const playNotifSound = () => {
      
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.play().catch(error => console.log("Audio blocked by browser:", error));
      setTimeout(() => {
          alert("You have no new notifications right now!");
      }, 100);
  };

  return (
    <div className="d-flex vh-100 bg-light" style={{ overflow: 'hidden' }}>
      <Sidebar onLogout={handleSignOut} />

      <div className="flex-grow-1 d-flex flex-column" style={{ overflowY: 'auto' }}>
        <div className="d-flex justify-content-end align-items-center p-3 bg-white border-bottom shadow-sm z-1">
           
           {/* ✨ THE UI: Clickable bell with sound and red dot */}
           <div className="position-relative me-4" style={{ cursor: 'pointer' }} onClick={playNotifSound} title="Notifications">
               <i className="bi bi-bell fs-5 text-muted hover-primary"></i>
               <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
                   <span className="visually-hidden">New alerts</span>
               </span>
           </div>
           
           <div className="d-flex align-items-center me-4">
             <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center me-2 shadow-sm overflow-hidden" style={{width: '35px', height: '35px'}}>
               {currentUser?.avatar ? (
                 <img src={currentUser.avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
               ) : (
                 <i className="bi bi-person"></i>
               )}
             </div>
             <div className="d-flex flex-column">
               <span className="fw-bold" style={{ fontSize: '0.9rem' }}>{currentUser?.name || 'Admin'}</span>
               <span className="text-muted" style={{ fontSize: '0.75rem' }}>{currentUser?.role || 'Student Account'}</span>
             </div>
           </div>

           <button onClick={handleSignOut} className="btn btn-outline-danger btn-sm rounded-pill fw-bold px-3 d-flex align-items-center shadow-sm">
             <i className="bi bi-box-arrow-right me-2"></i> Logout
           </button>
        </div>

        <div className="p-4 h-100">
          <Outlet context={{ 
            currentUser, 
            updateUser, 
            conversations, 
            lessons, 
            quizzes, 
            generateContentFromDocument, 
            generateStandaloneLesson, 
            generateStandaloneQuiz,   
            addConversation, 
            deleteConversation, 
            deleteLesson,      
            deleteQuiz,       
            addMessageToChat, 
            markQuizCompleted,
            onLogout                 
          }} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;