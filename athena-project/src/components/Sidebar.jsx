import React from 'react';
import { NavLink } from 'react-router-dom';
import athenaLogo from '../assets/athena.png'; 

const Sidebar = ({ onLogout }) => {
  return (
    <>
      <style>{`
        /* Minimalist Active State */
        .sidebar-nav-link.active {
          background-color: #ffffff !important;
          color: #0d6efd !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04) !important;
          font-weight: 700 !important;
        }
        .hover-bg-light:hover {
          background-color: rgba(0,0,0,0.03);
        }
        .hover-danger:hover {
          background-color: #fff0f0;
          color: #dc3545 !important;
        }
      `}</style>

      <div 
        className="border-end d-flex flex-column p-3 shadow-sm z-2 flex-shrink-0" 
        style={{ width: '240px', height: '100vh', backgroundColor: '#f0f7ff', overflow: 'hidden' }}
      >
        
        {/* --- BRANDING --- */}
        <div className="d-flex align-items-center mb-4 mt-2 px-2">
          <img src={athenaLogo} alt="Athena Logo" style={{ width: '36px', height: '36px', objectFit: 'contain' }} className="me-2" />
          <div className="d-flex flex-column">
            <h5 className="fw-bolder m-0 text-primary" style={{ letterSpacing: '0.5px', fontSize: '1.25rem' }}>ATHENA</h5>
            <small className="text-muted fw-medium" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>AI Tutor</small>
          </div>
        </div>

        {/* --- NAVIGATION LINKS --- */}
        <div className="flex-grow-1 mt-1">
          <ul className="nav flex-column gap-1">
            <li className="nav-item">
              <NavLink to="/dashboard/home" className={({isActive}) => `sidebar-nav-link nav-link fw-semibold px-3 py-2 rounded-3 transition-all d-flex align-items-center ${isActive ? 'active' : 'text-dark hover-bg-light'}`} style={{fontSize: '0.95rem'}}>
                <i className="bi bi-house me-3 fs-5 opacity-75"></i>Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/dashboard/lessons" className={({isActive}) => `sidebar-nav-link nav-link fw-semibold px-3 py-2 rounded-3 transition-all d-flex align-items-center ${isActive ? 'active' : 'text-dark hover-bg-light'}`} style={{fontSize: '0.95rem'}}>
                <i className="bi bi-journal-text me-3 fs-5 opacity-75"></i>My Lessons
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/dashboard/quizzes" className={({isActive}) => `sidebar-nav-link nav-link fw-semibold px-3 py-2 rounded-3 transition-all d-flex align-items-center ${isActive ? 'active' : 'text-dark hover-bg-light'}`} style={{fontSize: '0.95rem'}}>
                <i className="bi bi-ui-checks me-3 fs-5 opacity-75"></i>Quizzes
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/dashboard/ai-tutor" className={({isActive}) => `sidebar-nav-link nav-link fw-semibold px-3 py-2 rounded-3 transition-all d-flex align-items-center ${isActive ? 'active' : 'text-dark hover-bg-light'}`} style={{fontSize: '0.95rem'}}>
                <i className="bi bi-chat-dots me-3 fs-5 opacity-75"></i>AI Tutor
              </NavLink>
            </li>
            {/* THE FIX: Removed mt-3 so the spacing is perfectly even! */}
            <li className="nav-item">
              <NavLink to="/dashboard/progress" className={({isActive}) => `sidebar-nav-link nav-link fw-semibold px-3 py-2 rounded-3 transition-all d-flex align-items-center ${isActive ? 'active' : 'text-dark hover-bg-light'}`} style={{fontSize: '0.95rem'}}>
                <i className="bi bi-graph-up me-3 fs-5 opacity-75"></i>Progress
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/dashboard/settings" className={({isActive}) => `sidebar-nav-link nav-link fw-semibold px-3 py-2 rounded-3 transition-all d-flex align-items-center ${isActive ? 'active' : 'text-dark hover-bg-light'}`} style={{fontSize: '0.95rem'}}>
                <i className="bi bi-gear me-3 fs-5 opacity-75"></i>Settings
              </NavLink>
            </li>
          </ul>
        </div>

        {/* --- FOOTER / LOGOUT --- */}
        <div className="mt-auto pt-3 border-top border-secondary border-opacity-10">
          
          {/* --- MINIMALIST HELP WIDGET --- */}
          <div className="bg-white rounded-3 p-3 text-center border shadow-sm mx-1 mb-3">
             <i className="bi bi-robot fs-5 text-primary mb-2 d-block"></i>
             <p className="text-muted mb-3 fw-medium" style={{fontSize: '0.8rem', lineHeight: '1.2'}}>Need help with your lessons?</p>
             <NavLink to="/dashboard/ai-tutor" className="btn btn-outline-primary btn-sm w-100 rounded-pill fw-semibold" style={{fontSize: '0.85rem'}}>
                Ask Athena
             </NavLink>
          </div>

          <button 
            onClick={onLogout} 
            className="btn btn-link text-secondary text-decoration-none fw-semibold px-3 py-2 w-100 text-start d-flex align-items-center rounded-3 hover-danger transition-all"
            style={{fontSize: '0.95rem'}}
          >
            <i className="bi bi-box-arrow-left me-3 fs-5"></i>Logout
          </button>
        </div>

      </div>
    </>
  );
};

export default Sidebar;