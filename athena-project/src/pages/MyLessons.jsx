import React, { useState } from 'react';
import { Row, Col, Modal, Spinner } from 'react-bootstrap'; 
import { useOutletContext, useNavigate } from 'react-router-dom';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=DM+Sans:wght@400;500&display=swap');

  .lessons-wrapper {
    font-family: 'DM Sans', sans-serif;
    background: #f6f7fb;
    min-height: 100vh;
    padding: 2.5rem 2rem 4rem;
  }

  .lessons-page-title {
    font-family: 'Sora', sans-serif;
    font-size: 2rem;
    font-weight: 700;
    color: #0f0f1a;
    margin: 0 0 0.25rem;
    letter-spacing: -0.5px;
  }

  .lessons-page-sub {
    font-size: 0.95rem;
    color: #7b7f93;
    margin: 0 0 2rem;
  }

  /* --- LESSON CARD --- */
  .lesson-card {
    background: #ffffff;
    border-radius: 20px;
    border: 1.5px solid #ebebf0;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    height: 100%;
    cursor: pointer;
    transition: box-shadow 0.2s, transform 0.2s;
  }

  .lesson-card:hover {
    box-shadow: 0 8px 32px rgba(60,60,120,0.08);
    transform: translateY(-2px);
  }

  .lesson-card-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .lesson-status-badge {
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    background: #eef2ff;
    color: #4f46e5;
    padding: 3px 10px;
    border-radius: 20px;
  }

  .lesson-date {
    font-size: 0.78rem;
    font-weight: 500;
    color: #9497a8;
  }

  .lesson-icon-wrap {
    width: 46px;
    height: 46px;
    border-radius: 14px;
    background: linear-gradient(135deg, #c7d2fe 0%, #a5b4fc 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3rem;
    flex-shrink: 0;
  }

  .lesson-card-title {
    font-family: 'Sora', sans-serif;
    font-size: 1.05rem;
    font-weight: 700;
    color: #0f0f1a;
    margin: 0;
    line-height: 1.3;
    letter-spacing: -0.2px;
  }

  .lesson-card-desc {
    font-size: 0.875rem;
    color: #9497a8;
    line-height: 1.5;
    margin: 0;
    flex-grow: 1;
  }

  .lesson-card-footer {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: auto;
  }

  .btn-read-lesson {
    flex: 1;
    background: #4f46e5;
    color: #fff;
    border: none;
    border-radius: 12px;
    padding: 0.65rem 1rem;
    font-family: 'Sora', sans-serif;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: background 0.18s, transform 0.15s;
  }

  .btn-read-lesson:hover {
    background: #3730a3;
    transform: scale(1.02);
  }

  .btn-delete-lesson {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    background: #fff0f0;
    border: 1.5px solid #ffd6d6;
    color: #e53e3e;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    cursor: pointer;
    flex-shrink: 0;
    transition: background 0.15s, transform 0.15s;
  }

  .btn-delete-lesson:hover {
    background: #ffe0e0;
    transform: scale(1.05);
  }

  /* --- EMPTY STATE --- */
  .empty-state {
    background: #fff;
    border-radius: 20px;
    border: 1.5px dashed #d0d4e8;
    padding: 4rem 2rem;
    text-align: center;
    margin-top: 1rem;
  }

  .empty-icon-wrap {
    width: 80px;
    height: 80px;
    border-radius: 24px;
    background: #eef2ff;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.25rem;
    font-size: 2rem;
  }

  .empty-title {
    font-family: 'Sora', sans-serif;
    font-size: 1.25rem;
    font-weight: 700;
    color: #0f0f1a;
    margin-bottom: 0.5rem;
  }

  .empty-sub {
    font-size: 0.9rem;
    color: #9497a8;
    max-width: 360px;
    margin: 0 auto 1.5rem;
    line-height: 1.6;
  }

  .btn-go-tutor {
    background: #4f46e5;
    color: #fff;
    border: none;
    border-radius: 12px;
    padding: 0.65rem 1.5rem;
    font-family: 'Sora', sans-serif;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: background 0.18s;
  }

  .btn-go-tutor:hover {
    background: #3730a3;
  }

  /* --- READER MODAL --- */
  .lesson-modal .modal-content {
    border-radius: 24px;
    border: none;
    overflow: hidden;
    font-family: 'DM Sans', sans-serif;
    box-shadow: 0 24px 80px rgba(10,10,40,0.18);
  }

  .lesson-modal .modal-header {
    background: #4f46e5;
    border: none;
    padding: 1.25rem 1.75rem;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .lesson-modal-icon {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background: rgba(255,255,255,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
    flex-shrink: 0;
  }

  .lesson-modal .modal-title {
    font-family: 'Sora', sans-serif;
    font-size: 1.2rem;
    font-weight: 600;
    color: #fff;
    letter-spacing: -0.2px;
  }

  .lesson-modal .btn-close {
    filter: invert(1) brightness(2);
    opacity: 0.8;
  }

  .lesson-modal .modal-body {
    padding: 2.5rem 2.5rem;
    background: #fafafe;
    color: #3a3a4a;
    font-size: 1rem;
    line-height: 1.8;
  }

  .lesson-modal .modal-body h1, 
  .lesson-modal .modal-body h2, 
  .lesson-modal .modal-body h3 {
    font-family: 'Sora', sans-serif;
    font-weight: 700;
    color: #0f0f1a;
    margin-top: 1.5rem;
    margin-bottom: 1rem;
  }
  
  .lesson-modal .modal-body ul, 
  .lesson-modal .modal-body ol {
    margin-bottom: 1.5rem;
  }

  .lesson-modal .modal-body p {
    margin-bottom: 1.2rem;
  }

  .lesson-modal .modal-footer {
    background: #fff;
    border-top: 1.5px solid #ebebf0;
    padding: 1rem 1.75rem;
    gap: 10px;
  }

  .btn-modal-close {
    background: #f0f1f8;
    color: #4f46e5;
    border: none;
    border-radius: 12px;
    padding: 0.6rem 1.5rem;
    font-family: 'Sora', sans-serif;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s;
  }

  .btn-modal-close:hover {
    background: #e0e2f5;
  }

  .btn-modal-quiz {
    background: #4f46e5;
    color: #fff;
    border: none;
    border-radius: 12px;
    padding: 0.6rem 1.5rem;
    font-family: 'Sora', sans-serif;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: background 0.18s;
  }

  .btn-modal-quiz:hover:not(:disabled) {
    background: #3730a3;
  }

  .btn-modal-quiz:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const MyLessons = () => {
  const { lessons, deleteLesson, quizzes, generateStandaloneQuiz } = useOutletContext();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);

  const handleOpenLesson = (lesson) => {
    setSelectedLesson(lesson);
    setShowModal(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Recently Added";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Recently Added" : date.toLocaleDateString();
  };

  const createMarkup = (htmlString) => {
    if (!htmlString) return { __html: "" };
    const formatted = htmlString.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return { __html: formatted };
  };

 
  const handleTakeQuiz = async () => {
      if (!selectedLesson) return;

      
      const baseTopic = selectedLesson.title.replace(' - Master Handout', '').trim();
      
      
      const existingQuiz = quizzes?.find(q => q.title.includes(baseTopic) || baseTopic.includes(q.title.replace(/\s*\(.*?\)\s*/g, '')));

      if (existingQuiz) {
          
          setShowModal(false);
          navigate('/dashboard/quizzes');
      } else {
          
          setIsGeneratingQuiz(true);
          try {
              
              await generateStandaloneQuiz(baseTopic, 5, 'Medium', '');
              
              setShowModal(false);
              navigate('/dashboard/quizzes');
          } catch (error) {
              console.error("Failed to auto-generate quiz:", error);
              alert("Something went wrong while asking Athena to build this quiz.");
          } finally {
              setIsGeneratingQuiz(false);
          }
      }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="lessons-wrapper">
        <h2 className="lessons-page-title">My Lessons</h2>
        <p className="lessons-page-sub">Review your generated handouts and study materials.</p>

        {lessons?.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon-wrap">📓</div>
            <div className="empty-title">No lessons generated yet!</div>
            <p className="empty-sub">
              Head over to the AI Tutor, upload a document or notes, and Athena will automatically generate custom study handouts for you.
            </p>
            <button className="btn-go-tutor" onClick={() => navigate('/dashboard/ai-tutor')}>
              <i className="bi bi-chat-dots"></i> Go to AI Tutor
            </button>
          </div>
        ) : (
          <Row className="g-4">
            {lessons.map((lesson) => (
              <Col md={4} sm={6} key={lesson.id}>
                <div className="lesson-card" onClick={() => handleOpenLesson(lesson)}>
                  <div className="lesson-card-top">
                    <span className="lesson-status-badge">{lesson.status || 'New'}</span>
                    <span className="lesson-date">{formatDate(lesson.created_at)}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="lesson-icon-wrap">📄</div>
                    <h5 className="lesson-card-title">{lesson.title.replace(' - Master Handout', '')}</h5>
                  </div>

                  <p className="lesson-card-desc">
                    An automatically generated master handout based on your uploaded document. Click to review key concepts and summaries.
                  </p>

                  <div className="lesson-card-footer">
                    <button className="btn-read-lesson" onClick={(e) => { e.stopPropagation(); handleOpenLesson(lesson); }}>
                      <i className="bi bi-book"></i> Read Handout
                    </button>
                    <button
                      className="btn-delete-lesson"
                      onClick={(e) => { e.stopPropagation(); deleteLesson(lesson.id); }}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        )}
      </div>

      {/* READER MODAL */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered scrollable className="lesson-modal">
        <Modal.Header closeButton>
          <div className="lesson-modal-icon">📄</div>
          <Modal.Title>{selectedLesson?.title?.replace(' - Master Handout', '')}</Modal.Title>
        </Modal.Header>
        
        <Modal.Body dangerouslySetInnerHTML={createMarkup(selectedLesson?.content)} />
        
        <Modal.Footer>
          <button className="btn-modal-close" onClick={() => setShowModal(false)} disabled={isGeneratingQuiz}>
            Close Reader
          </button>
          
          {/*  */}
          <button 
            className="btn-modal-quiz" 
            onClick={handleTakeQuiz}
            disabled={isGeneratingQuiz}
          >
            {isGeneratingQuiz ? (
                <><Spinner size="sm" className="me-2"/> Generating Quiz...</>
            ) : (
                <>Take the Quiz <i className="bi bi-arrow-right"></i></>
            )}
          </button>

        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MyLessons;