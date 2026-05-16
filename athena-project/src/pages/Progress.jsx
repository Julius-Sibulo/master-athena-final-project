import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useOutletContext, useNavigate } from 'react-router-dom';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=DM+Sans:wght@400;500&display=swap');

  .progress-wrapper {
    font-family: 'DM Sans', sans-serif;
    background: #f6f7fb;
    height: calc(100vh - 110px); /* THE FIX: Locks it to the screen */
    overflow-y: auto;            /* THE FIX: Internal scroll only */
    padding: 1.5rem 2rem 4rem;
  }

  .progress-page-title {
    font-family: 'Sora', sans-serif;
    font-size: 2rem;
    font-weight: 700;
    color: #0f0f1a;
    margin: 0 0 0.25rem;
    letter-spacing: -0.5px;
  }

  .progress-page-sub {
    font-size: 0.95rem;
    color: #7b7f93;
    margin: 0 0 2rem;
  }

  /* --- STAT CARDS --- */
  .stat-card {
    background: #fff;
    border-radius: 20px;
    border: 1.5px solid #ebebf0;
    padding: 1.25rem 1.5rem;
    display: flex;
    align-items: center;
    gap: 14px;
    height: 100%;
  }

  .stat-card.accent {
    background: #4f46e5;
    border-color: #4f46e5;
  }

  .stat-icon {
    width: 50px;
    height: 50px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3rem;
    flex-shrink: 0;
  }

  .stat-icon.indigo { background: rgba(255,255,255,0.18); color: #fff; }
  .stat-icon.purple { background: #eef2ff; color: #4f46e5; }
  .stat-icon.green  { background: #ecfdf5; color: #059669; }

  .stat-label {
    font-size: 0.8rem;
    font-weight: 500;
    color: #7b7f93;
    margin: 0 0 2px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .stat-card.accent .stat-label { color: rgba(255,255,255,0.7); }

  .stat-value {
    font-family: 'Sora', sans-serif;
    font-size: 1.75rem;
    font-weight: 700;
    color: #0f0f1a;
    margin: 0;
    line-height: 1;
  }

  .stat-card.accent .stat-value { color: #fff; }

  /* --- SECTION HEADING --- */
  .section-heading {
    font-family: 'Sora', sans-serif;
    font-size: 1.1rem;
    font-weight: 700;
    color: #0f0f1a;
    margin: 2rem 0 1rem;
    letter-spacing: -0.2px;
  }

  /* --- PROGRESS ITEM --- */
  .progress-item {
    background: #fff;
    border-radius: 20px;
    border: 1.5px solid #ebebf0;
    padding: 1.5rem;
    margin-bottom: 1rem;
    transition: box-shadow 0.2s;
  }

  .progress-item:hover {
    box-shadow: 0 6px 24px rgba(60,60,120,0.07);
  }

  .progress-item-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
  }

  .progress-topic-title {
    font-family: 'Sora', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    color: #0f0f1a;
    margin: 0 0 8px;
    letter-spacing: -0.2px;
  }

  .progress-badges {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .badge-mastered {
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    background: #ecfdf5;
    color: #065f46;
    padding: 3px 10px;
    border-radius: 20px;
  }

  .badge-in-progress {
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    background: #fffbeb;
    color: #92400e;
    padding: 3px 10px;
    border-radius: 20px;
  }

  .badge-pct {
    font-size: 0.8rem;
    font-weight: 600;
    color: #7b7f93;
  }

  .progress-toggle {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    background: #f0f1f8;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #4f46e5;
    font-size: 0.9rem;
    flex-shrink: 0;
    transition: background 0.15s, transform 0.15s;
  }

  .progress-toggle:hover {
    background: #e0e2f5;
    transform: scale(1.05);
  }

  .custom-progress-track {
    height: 8px;
    background: #ebebf0;
    border-radius: 99px;
    overflow: hidden;
  }

  .custom-progress-fill {
    height: 100%;
    border-radius: 99px;
    transition: width 0.5s ease;
  }

  .fill-success { background: linear-gradient(90deg, #34d399, #10b981); }
  .fill-primary { background: linear-gradient(90deg, #818cf8, #4f46e5); }

  /* --- EXPANDED PANEL --- */
  .expanded-panel {
    margin-top: 1.25rem;
    padding-top: 1.25rem;
    border-top: 1.5px solid #ebebf0;
  }

  .sneak-peek-label {
    font-family: 'Sora', sans-serif;
    font-size: 0.85rem;
    font-weight: 700;
    color: #0f0f1a;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .sneak-peek-text {
    font-size: 0.875rem;
    color: #7b7f93;
    line-height: 1.6;
    margin: 0 0 1rem;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .expanded-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .btn-handout {
    background: transparent;
    color: #4f46e5;
    border: 1.5px solid #c7d2fe;
    border-radius: 10px;
    padding: 0.5rem 1.1rem;
    font-family: 'Sora', sans-serif;
    font-size: 0.82rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s;
  }

  .btn-handout:hover {
    background: #eef2ff;
    border-color: #a5b4fc;
  }

  .btn-finish-quiz {
    background: #fef3c7;
    color: #92400e;
    border: 1.5px solid #fde68a;
    border-radius: 10px;
    padding: 0.5rem 1.1rem;
    font-family: 'Sora', sans-serif;
    font-size: 0.82rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s;
  }

  .btn-finish-quiz:hover {
    background: #fde68a;
  }

  /* --- EMPTY STATE --- */
  .empty-state {
    background: #fff;
    border-radius: 20px;
    border: 1.5px dashed #d0d4e8;
    padding: 4rem 2rem;
    text-align: center;
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
    font-size: 1.2rem;
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

  .btn-go-tutor:hover { background: #3730a3; }
`;

const ProgressItem = ({ lesson, quizzes }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  // Safely grab the topic name and strip out AI formatting
  const baseTopic = lesson.title.replace(' - Master Handout', '');
  
  // Find a matching quiz to calculate the progress
  const safeQuizzes = quizzes || [];
  const matchingQuiz = safeQuizzes.find(q => q.title.includes(baseTopic));
  
  const progressValue = matchingQuiz?.status === 'Completed' ? 100 : 50;
  const isMastered = progressValue === 100;

  // Strips AI Markdown so the preview looks like clean, normal text
  const cleanPreviewText = lesson.content 
    ? lesson.content.replace(/[#*`_]/g, '').replace(/<[^>]*>?/gm, '') 
    : "No content available.";

  return (
    <div className="progress-item">
      <div className="progress-item-top">
        <div style={{ flex: 1, paddingRight: '12px' }}>
          <div className="progress-topic-title">{baseTopic}</div>
          <div className="progress-badges">
            <span className={isMastered ? 'badge-mastered' : 'badge-in-progress'}>
              {isMastered ? '✓ Mastered' : 'In Progress'}
            </span>
            <span className="badge-pct">{progressValue}% complete</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {isExpanded && (
            <button className="btn-handout" onClick={() => navigate('/dashboard/lessons')}>
              Review Handout
            </button>
          )}
          <button className="progress-toggle" onClick={() => setIsExpanded(!isExpanded)}>
            <i className={`bi ${isExpanded ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
          </button>
        </div>
      </div>

      <div className="custom-progress-track">
        <div
          className={`custom-progress-fill ${isMastered ? 'fill-success' : 'fill-primary'}`}
          style={{ width: `${progressValue}%` }}
        />
      </div>

      {isExpanded && (
        <div className="expanded-panel">
          <div className="sneak-peek-label">
            ✨ Study Notes Sneak Peek
          </div>
          <p className="sneak-peek-text">{cleanPreviewText}</p>
          <div className="expanded-actions">
            <button className="btn-handout" onClick={() => navigate('/dashboard/lessons')}>
              <i className="bi bi-file-earmark-text me-1"></i> Open Full Handout
            </button>
            {!isMastered && (
              <button className="btn-finish-quiz" onClick={() => navigate('/dashboard/quizzes')}>
                <i className="bi bi-lightning-fill me-1"></i> Finish Quiz to Mastery
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const Progress = () => {
  const { lessons, quizzes } = useOutletContext();
  const navigate = useNavigate();

  // Safely calculate stats so it doesn't crash if the database is still loading
  const totalLessons = lessons?.length || 0;
  const safeQuizzes = quizzes || [];
  const completedQuizzes = safeQuizzes.filter(q => q.status === 'Completed').length;
  const overallAccuracy = safeQuizzes.length > 0 ? Math.round((completedQuizzes / safeQuizzes.length) * 100) : 0;

  return (
    <>
      <style>{styles}</style>
      <div className="progress-wrapper">
        <h2 className="progress-page-title">Progress Report</h2>
        <p className="progress-page-sub">Dynamic tracking of your study mastery.</p>

        {/* STAT CARDS */}
        <Row className="g-3 mb-2">
          <Col md={4}>
            <div className="stat-card accent">
              <div className="stat-icon indigo">
                <i className="bi bi-graph-up-arrow"></i>
              </div>
              <div>
                <p className="stat-label">Mastery Rate</p>
                <div className="stat-value">{totalLessons === 0 ? '—' : `${overallAccuracy}%`}</div>
              </div>
            </div>
          </Col>
          <Col md={4} xs={6}>
            <div className="stat-card">
              <div className="stat-icon purple">
                <i className="bi bi-book-half"></i>
              </div>
              <div>
                <p className="stat-label">Total Topics</p>
                <div className="stat-value">{totalLessons}</div>
              </div>
            </div>
          </Col>
          <Col md={4} xs={6}>
            <div className="stat-card">
              <div className="stat-icon green">
                <i className="bi bi-patch-check-fill"></i>
              </div>
              <div>
                <p className="stat-label">Quizzes Passed</p>
                <div className="stat-value">{completedQuizzes}</div>
              </div>
            </div>
          </Col>
        </Row>

        <div className="section-heading">Topic Mastery Breakdown</div>

        {!lessons || lessons.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon-wrap">📊</div>
            <div className="empty-title">No data yet!</div>
            <p className="empty-sub">
              Generate study handouts in the AI Tutor tab to see your progress tracked here.
            </p>
            <button className="btn-go-tutor" onClick={() => navigate('/dashboard/ai-tutor')}>
              <i className="bi bi-chat-dots"></i> Go to AI Tutor
            </button>
          </div>
        ) : (
          lessons.map(lesson => (
            <ProgressItem key={lesson.id} lesson={lesson} quizzes={safeQuizzes} />
          ))
        )}
      </div>
    </>
  );
};

export default Progress;