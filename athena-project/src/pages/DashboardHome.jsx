import React from 'react';
import { Row, Col, Carousel } from 'react-bootstrap'; 
import { useOutletContext, useNavigate } from 'react-router-dom';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=DM+Sans:wght@400;500&display=swap');

  .dash-wrapper {
    font-family: 'DM Sans', sans-serif;
    background: #f6f7fb;
    height: calc(100vh - 110px);
    overflow-y: auto;
    padding: 1.5rem 2rem 1rem;
  }

  /* ---- SECTION HEADERS ---- */
  .section-label {
    font-family: 'Sora', sans-serif;
    font-size: 1.15rem;
    font-weight: 700;
    color: #0f0f1a;
    margin: 0 0 0.5rem;
    display: flex;
    align-items: center;
    gap: 7px;
    letter-spacing: -0.1px;
  }

  .section-label i { color: #4f46e5; font-size: 1.2rem; }

  .section-link {
    font-family: 'Sora', sans-serif;
    font-size: 0.95rem;
    font-weight: 600;
    color: #4f46e5;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 4px;
    transition: opacity 0.15s;
  }

  .section-link:hover { opacity: 0.7; }

  /* ---- HERO CONTINUE CARD ---- */
  .hero-card {
    border-radius: 20px;
    background: linear-gradient(135deg, #4f46e5 0%, #6366f1 60%, #818cf8 100%);
    padding: 1.75rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
    position: relative;
    overflow: hidden;
    margin-bottom: 1.25rem;
  }

  .hero-card::before {
    content: '';
    position: absolute;
    top: -40px; right: -40px;
    width: 180px; height: 180px;
    border-radius: 50%;
    background: rgba(255,255,255,0.07);
  }

  .hero-card::after {
    content: '';
    position: absolute;
    bottom: -30px; left: 30%;
    width: 120px; height: 120px;
    border-radius: 50%;
    background: rgba(255,255,255,0.05);
  }

  .hero-eyebrow {
    font-family: 'Sora', sans-serif;
    font-size: 0.85rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.65);
    margin-bottom: 8px;
  }

  .hero-title {
    font-family: 'Sora', sans-serif;
    font-size: 1.7rem;
    font-weight: 700;
    color: #fff;
    margin: 0 0 8px;
    letter-spacing: -0.3px;
    line-height: 1.3;
  }

  .hero-meta {
    font-size: 1rem;
    color: rgba(255,255,255,0.6);
    margin: 0;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .btn-hero-continue {
    background: #fff;
    color: #4f46e5;
    border: none;
    border-radius: 12px;
    padding: 0.8rem 2rem;
    font-family: 'Sora', sans-serif;
    font-size: 1.05rem;
    font-weight: 700;
    cursor: pointer;
    white-space: nowrap;
    position: relative;
    z-index: 1;
    transition: transform 0.15s, box-shadow 0.15s;
    flex-shrink: 0;
  }

  .btn-hero-continue:hover {
    transform: scale(1.03);
    box-shadow: 0 6px 20px rgba(0,0,0,0.15);
  }

  .hero-empty {
    border-radius: 20px;
    border: 1.5px dashed #d0d4e8;
    background: #fff;
    padding: 2rem;
    text-align: center;
    margin-bottom: 1.25rem;
  }

  .hero-empty-text {
    font-size: 1.05rem;
    color: #9497a8;
    margin: 0 0 1.2rem;
  }

  .btn-go-tutor {
    background: #4f46e5;
    color: #fff;
    border: none;
    border-radius: 12px;
    padding: 0.75rem 1.6rem;
    font-family: 'Sora', sans-serif;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: background 0.15s;
  }

  .btn-go-tutor:hover { background: #3730a3; }

  /* ---- QUIZ MINI CARDS ---- */
  .quiz-mini-card {
    background: #fff;
    border-radius: 16px;
    border: 1.5px solid #ebebf0;
    padding: 1.2rem 1.3rem;
    cursor: pointer;
    height: 100%;
    transition: box-shadow 0.2s, transform 0.2s;
  }

  .quiz-mini-card:hover {
    box-shadow: 0 6px 20px rgba(60,60,120,0.08);
    transform: translateY(-2px);
  }

  .quiz-mini-status {
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    padding: 4px 12px;
    border-radius: 20px;
    display: inline-block;
    margin-bottom: 10px;
  }

  .quiz-mini-status.done { background: #ecfdf5; color: #065f46; }
  .quiz-mini-status.practice { background: #eef2ff; color: #4f46e5; }

  .quiz-mini-title {
    font-family: 'Sora', sans-serif;
    font-size: 1.05rem;
    font-weight: 700;
    color: #0f0f1a;
    margin: 0;
    line-height: 1.35;
  }

  /* ---- FEATURED CAROUSEL ---- */
  .promo-carousel {
    border-radius: 20px;
    overflow: hidden;
    margin-top: 1rem;
    border: 1.5px solid #ebebf0;
    box-shadow: 0 6px 24px rgba(60,60,120,0.05);
  }
  
  .promo-carousel .carousel-item {
    height: 220px;
    background-color: #0f0f1a;
  }
  
  .promo-carousel img {
    object-fit: cover;
    height: 100%;
    width: 100%;
    opacity: 0.55; /* Darken image to make text pop */
    transition: opacity 0.3s ease;
  }

  .promo-carousel .carousel-caption {
    bottom: 25px;
    text-align: left;
    left: 40px;
    right: 40px;
    padding-bottom: 0;
  }

  .promo-caption-badge {
    display: inline-block;
    background: rgba(255,255,255,0.2);
    backdrop-filter: blur(4px);
    color: #fff;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 4px 12px;
    border-radius: 20px;
    margin-bottom: 10px;
  }

  .promo-caption-title {
    font-family: 'Sora', sans-serif;
    font-weight: 700;
    font-size: 1.5rem;
    text-shadow: 0 2px 4px rgba(0,0,0,0.6);
    margin-bottom: 6px;
  }

  .promo-caption-text {
    font-size: 0.95rem;
    font-weight: 500;
    text-shadow: 0 2px 4px rgba(0,0,0,0.6);
    margin: 0;
    color: rgba(255,255,255,0.9);
  }

  /* Customizing standard bootstrap indicators */
  .carousel-indicators [data-bs-target] {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #fff;
    opacity: 0.5;
    margin: 0 6px;
    border: none;
  }
  .carousel-indicators .active {
    opacity: 1;
    transform: scale(1.2);
  }

  /* ---- PROFILE CARD ---- */
  .profile-card {
    background: #fff;
    border-radius: 20px;
    border: 1.5px solid #ebebf0;
    padding: 1.75rem;
    margin-bottom: 1.25rem;
  }

  .profile-avatar {
    width: 64px;
    height: 64px;
    border-radius: 16px;
    background: linear-gradient(135deg, #c7d2fe, #818cf8);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Sora', sans-serif;
    font-size: 1.8rem;
    font-weight: 700;
    color: #fff;
    flex-shrink: 0;
    overflow: hidden;
  }

  .profile-avatar img { width: 100%; height: 100%; object-fit: cover; }

  .profile-name {
    font-family: 'Sora', sans-serif;
    font-size: 1.2rem;
    font-weight: 700;
    color: #0f0f1a;
    margin: 0 0 4px;
  }

  .profile-role {
    font-size: 0.95rem;
    color: #9497a8;
    font-weight: 500;
  }

  .profile-divider {
    height: 1.5px;
    background: #ebebf0;
    margin: 1.3rem 0;
  }

  .stat-row {
    display: flex;
    gap: 12px;
  }

  .stat-box {
    flex: 1;
    background: #f6f7fb;
    border-radius: 14px;
    padding: 1.2rem 0.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .stat-box-icon { 
    font-size: 1.4rem; 
    margin-bottom: 6px; 
  }
  
  .stat-box-label {
    font-size: 0.75rem; 
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: #9497a8;
    margin-bottom: 0;
    line-height: 1.3;
    text-align: center;
  }
  
  .stat-box-value {
    font-family: 'Sora', sans-serif;
    font-size: 1.6rem; 
    font-weight: 700;
    color: #0f0f1a;
    margin: 0;
    margin-top: auto;        
    padding-top: 12px;
    display: flex;
    align-items: baseline;   
    justify-content: center;
    gap: 4px;
  }

  /* ---- ACTIVITY LOG ---- */
  .activity-card {
    background: #fff;
    border-radius: 20px;
    border: 1.5px solid #ebebf0;
    overflow: hidden;
  }

  .activity-card-header {
    padding: 1rem 1.25rem;
    background: #f6f7fb;
    border-bottom: 1.5px solid #ebebf0;
    font-family: 'Sora', sans-serif;
    font-size: 0.9rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #7b7f93;
  }

  .activity-list { padding: 0.5rem 0; }

  .activity-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.8rem 1.25rem;
    border-bottom: 1.5px solid #f0f1f8;
    transition: background 0.15s;
    cursor: default;
  }

  .activity-row:last-child { border-bottom: none; }
  .activity-row:hover { background: #fafafe; }

  .activity-file-icon {
    width: 36px;
    height: 36px;
    border-radius: 9px;
    background: #eef2ff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    color: #4f46e5;
    flex-shrink: 0;
    margin-right: 12px;
  }

  .activity-file-name {
    font-size: 1rem;
    font-weight: 500;
    color: #0f0f1a;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 180px;
  }

  .activity-date {
    font-size: 0.85rem;
    color: #b0b3c4;
    font-weight: 500;
    flex-shrink: 0;
  }

  .activity-empty {
    padding: 1.5rem;
    text-align: center;
    font-size: 1rem;
    color: #b0b3c4;
  }
`;

const DashboardHome = () => {
  const { currentUser, lessons, quizzes } = useOutletContext();
  const navigate = useNavigate();

  const activeLessonsCount = lessons?.length || 0;
  const quizzesPassedCount = quizzes?.filter(q => q.status === 'Completed').length || 0;
  const latestLesson = lessons && lessons.length > 0 ? lessons[0] : null;

  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Recently" : date.toLocaleDateString();
  };

  return (
    <>
      <style>{styles}</style>
      <div className="dash-wrapper">
        <Row className="g-4">

          {/* LEFT COLUMN */}
          <Col lg={8} className="d-flex flex-column">

            {/* Continue Learning */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="section-label">
                <i className="bi bi-journal-code"></i> Continue Learning
              </div>
            </div>

            {latestLesson ? (
              <div className="hero-card">
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div className="hero-eyebrow">Current Topic</div>
                  <div className="hero-title">{latestLesson.title.replace(' - Master Handout', '')}</div>
                  <div className="hero-meta">
                    <i className="bi bi-clock-history"></i>
                    Generated {formatDate(latestLesson.created_at)}
                  </div>
                </div>
                <button className="btn-hero-continue" onClick={() => navigate('/dashboard/lessons')}>
                  Continue →
                </button>
              </div>
            ) : (
              <div className="hero-empty">
                <p className="hero-empty-text">No lessons yet. Head to the AI Tutor to generate your first handout!</p>
                <button className="btn-go-tutor" onClick={() => navigate('/dashboard/ai-tutor')}>
                  <i className="bi bi-chat-dots"></i> Go to AI Tutor
                </button>
              </div>
            )}

            {/* Knowledge Checks */}
            <div className="d-flex justify-content-between align-items-center mb-2 mt-2">
              <div className="section-label">
                <i className="bi bi-patch-question"></i> Knowledge Checks
              </div>
              <a className="section-link" href="#" onClick={(e) => { e.preventDefault(); navigate('/dashboard/quizzes'); }}>
                View All <i className="bi bi-arrow-right"></i>
              </a>
            </div>

            <p style={{ fontSize: '1rem', color: '#9497a8', marginBottom: '1rem' }}>
              Practice opportunities based on what you recently learned.
            </p>

            {!quizzes || quizzes.length === 0 ? (
              <div style={{ background: '#fff', borderRadius: '16px', border: '1.5px dashed #d0d4e8', padding: '2rem', textAlign: 'center', fontSize: '1rem', color: '#b0b3c4' }}>
                No quizzes yet — they'll appear here after your first session.
              </div>
            ) : (
              <Row className="g-3">
                {quizzes.slice(0, 3).map((quiz) => (
                  <Col md={4} key={quiz.id}>
                    <div className="quiz-mini-card" onClick={() => navigate('/dashboard/quizzes')}>
                      <span className={`quiz-mini-status ${quiz.status === 'Completed' ? 'done' : 'practice'}`}>
                        {quiz.status === 'Completed' ? '✓ Completed' : 'Practice'}
                      </span>
                      <div className="quiz-mini-title">
                        {quiz.title.replace(' - Quiz', '').replace(' - Knowledge Check', '')}
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            )}

            {/* --- NEW FEATURED CAROUSEL --- */}
            <div className="d-flex justify-content-between align-items-center mb-2 mt-4">
              <div className="section-label">
                <i className="bi bi-stars"></i> Discover
              </div>
            </div>
            
            <Carousel className="promo-carousel" interval={4000} pause="hover">
              
              {/* Slide 1 */}
              <Carousel.Item>
                {/* Safe placeholder image, feel free to replace src with your own! */}
                <img
                  className="d-block w-100"
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                  alt="Study Tips"
                />
                <Carousel.Caption className="promo-caption">
                  <span className="promo-caption-badge">Pro Tip</span>
                  <h3 className="promo-caption-title">Master the Feynman Technique</h3>
                  <p className="promo-caption-text">Learn faster by teaching concepts back to Athena.</p>
                </Carousel.Caption>
              </Carousel.Item>

              {/* Slide 2 */}
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src="https://images.unsplash.com/photo-1497032205916-ac775f0649ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                  alt="Feature Highlight"
                />
                <Carousel.Caption className="promo-caption">
                  <span className="promo-caption-badge">New Feature</span>
                  <h3 className="promo-caption-title">Upload Documents</h3>
                  <p className="promo-caption-text">Attach your PDFs and let the AI generate a custom quiz.</p>
                </Carousel.Caption>
              </Carousel.Item>

              {/* Slide 3 */}
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                  alt="Motivation"
                />
                <Carousel.Caption className="promo-caption">
                  <span className="promo-caption-badge">Motivation</span>
                  <h3 className="promo-caption-title">Keep Your Streak Alive!</h3>
                  <p className="promo-caption-text">Log in daily to build unbreakable study habits.</p>
                </Carousel.Caption>
              </Carousel.Item>
              
            </Carousel>
            
          </Col>

          {/* RIGHT COLUMN */}
          <Col lg={4} className="d-flex flex-column">

            {/* Profile */}
            <div className="section-label mb-3">
              <i className="bi bi-person"></i> Profile
            </div>

            <div className="profile-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div className="profile-avatar">
                  {currentUser?.avatar
                    ? <img src={currentUser.avatar} alt="Avatar" />
                    : (currentUser?.name?.charAt(0).toUpperCase() || 'A')}
                </div>
                <div>
                  <div className="profile-name">{currentUser?.name || currentUser?.username || 'Student'}</div>
                  <div className="profile-role">Student Account</div>
                </div>
              </div>

              <div className="profile-divider"></div>

              <div className="stat-row">
                <div className="stat-box">
                  <div className="stat-box-icon">⚡</div>
                  <div className="stat-box-label">Daily Streak</div>
                  <div className="stat-box-value">
                    {currentUser?.streak || 0} 
                    <span style={{fontSize: '0.85rem', fontWeight: '600', color: '#9497a8'}}>Days</span>
                  </div>
                </div>
                <div className="stat-box">
                  <div className="stat-box-icon">✅</div>
                  <div className="stat-box-label">Quizzes Passed</div>
                  <div className="stat-box-value">{quizzesPassedCount}</div>
                </div>
                <div className="stat-box">
                  <div className="stat-box-icon">📚</div>
                  <div className="stat-box-label">Topics</div>
                  <div className="stat-box-value">{activeLessonsCount}</div>
                </div>
              </div>
            </div>

            {/* Activity Log */}
            <div className="section-label mb-3 mt-2">
              <i className="bi bi-trophy"></i> Activity Log
            </div>

            <div className="activity-card">
              <div className="activity-card-header">Recent Files Scanned</div>
              <div className="activity-list">
                {!lessons || lessons.length === 0 ? (
                  <div className="activity-empty">No files scanned yet.</div>
                ) : (
                  lessons.slice(0, 4).map((lesson) => (
                    <div key={lesson.id} className="activity-row">
                      <div style={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
                        <div className="activity-file-icon">
                          <i className="bi bi-file-earmark-text"></i>
                        </div>
                        <span className="activity-file-name">{lesson.title.replace(' - Master Handout', '')}</span>
                      </div>
                      <span className="activity-date">{formatDate(lesson.created_at)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

          </Col>
        </Row>
      </div>
    </>
  );
};

export default DashboardHome;