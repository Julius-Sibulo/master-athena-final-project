import React, { useState } from 'react';
import { Container, Row, Col, Modal, ProgressBar, Spinner, Form } from 'react-bootstrap';
import { useOutletContext } from 'react-router-dom';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=DM+Sans:wght@400;500&display=swap');

  .quizzes-wrapper {
    font-family: 'DM Sans', sans-serif;
    background: #f6f7fb;
    height: calc(100vh - 110px); 
    overflow-y: auto;            
    padding: 2.5rem 2rem 4rem;
  }

  .quiz-page-title {
    font-family: 'Sora', sans-serif;
    font-size: 2rem;
    font-weight: 700;
    color: #0f0f1a;
    margin: 0 0 0.25rem;
    letter-spacing: -0.5px;
  }

  .quiz-page-sub {
    font-size: 0.95rem;
    color: #7b7f93;
    margin: 0 0 2rem;
  }

  .quiz-card {
    background: #ffffff;
    border-radius: 20px;
    border: 1.5px solid #ebebf0;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    transition: box-shadow 0.2s, transform 0.2s;
    height: 100%;
  }

  .quiz-card:hover {
    box-shadow: 0 8px 32px rgba(60,60,120,0.08);
    transform: translateY(-2px);
  }

  .quiz-card-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .quiz-badge-new {
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    background: #eef2ff;
    color: #4f46e5;
    padding: 3px 10px;
    border-radius: 20px;
  }

  .quiz-icon-wrap {
    width: 46px;
    height: 46px;
    border-radius: 14px;
    background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3rem;
    flex-shrink: 0;
  }

  .quiz-card-title {
    font-family: 'Sora', sans-serif;
    font-size: 1.1rem;
    font-weight: 700;
    color: #0f0f1a;
    margin: 0;
    line-height: 1.3;
    letter-spacing: -0.2px;
  }

  .quiz-card-desc {
    font-size: 0.875rem;
    color: #9497a8;
    line-height: 1.5;
    margin: 0;
    flex-grow: 1;
  }

  .quiz-card-footer {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: auto;
  }

  .btn-start-quiz {
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

  .btn-start-quiz:hover:not(:disabled) {
    background: #3730a3;
    transform: scale(1.02);
  }
  
  .btn-start-quiz:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .btn-delete-quiz {
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

  .btn-delete-quiz:hover {
    background: #ffe0e0;
    transform: scale(1.05);
  }

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
    max-width: 340px;
    margin: 0 auto;
    line-height: 1.6;
  }

  /* --- MODAL --- */
  .quiz-modal .modal-content {
    border-radius: 24px;
    border: none;
    overflow: hidden;
    font-family: 'DM Sans', sans-serif;
    box-shadow: 0 24px 80px rgba(10,10,40,0.18);
  }

  .quiz-modal .modal-header {
    background: #4f46e5;
    border: none;
    padding: 1.25rem 1.75rem;
  }

  .quiz-modal .modal-title {
    font-family: 'Sora', sans-serif;
    font-size: 1rem;
    font-weight: 600;
    color: #fff;
    letter-spacing: -0.2px;
  }

  .quiz-modal .btn-close {
    filter: invert(1) brightness(2);
    opacity: 0.8;
  }

  .quiz-modal .modal-body {
    padding: 2rem 2.25rem 2.5rem;
    background: #fafafe;
  }

  .quiz-q-label {
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: #4f46e5;
  }

  .quiz-score-label {
    font-size: 0.85rem;
    font-weight: 600;
    color: #7b7f93;
  }

  .quiz-progress {
    height: 7px;
    border-radius: 99px;
    background: #e8e9f3;
    margin: 0.5rem 0 1.75rem;
    overflow: hidden;
  }

  .quiz-progress-bar {
    height: 100%;
    border-radius: 99px;
    background: linear-gradient(90deg, #4f46e5, #818cf8);
    transition: width 0.4s ease;
  }

  .quiz-question-text {
    font-family: 'Sora', sans-serif;
    font-size: 1.2rem;
    font-weight: 700;
    color: #0f0f1a;
    line-height: 1.5;
    margin-bottom: 1.5rem;
    letter-spacing: -0.3px;
  }

  .quiz-option-btn {
    width: 100%;
    background: #fff;
    border: 1.5px solid #e0e2ef;
    border-radius: 14px;
    padding: 0.85rem 1.1rem;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    font-weight: 500;
    color: #0f0f1a;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 10px;
    text-align: left;
    transition: border-color 0.15s, background 0.15s, transform 0.1s;
  }

  .quiz-option-btn:hover:not(:disabled) {
    border-color: #a5b4fc;
    background: #f5f3ff;
    transform: translateX(3px);
  }

  .quiz-option-btn:disabled {
    cursor: default;
  }

  .quiz-option-btn.correct {
    border-color: #34d399;
    background: #ecfdf5;
    color: #065f46;
  }

  .quiz-option-btn.wrong {
    border-color: #f87171;
    background: #fff5f5;
    color: #991b1b;
  }

  .option-letter {
    width: 30px;
    height: 30px;
    border-radius: 8px;
    background: #f0f1f8;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.82rem;
    font-weight: 700;
    color: #4f46e5;
    flex-shrink: 0;
  }

  .quiz-option-btn.correct .option-letter {
    background: #d1fae5;
    color: #065f46;
  }

  .quiz-option-btn.wrong .option-letter {
    background: #fee2e2;
    color: #991b1b;
  }

  .results-wrap {
    text-align: center;
    padding: 1rem 0;
  }

  .results-trophy {
    width: 90px;
    height: 90px;
    border-radius: 28px;
    background: linear-gradient(135deg, #fde68a, #f59e0b);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.5rem;
    margin: 0 auto 1.5rem;
  }

  .results-title {
    font-family: 'Sora', sans-serif;
    font-size: 1.6rem;
    font-weight: 700;
    color: #0f0f1a;
    margin-bottom: 0.4rem;
  }

  .results-sub {
    font-size: 1rem;
    color: #7b7f93;
    margin-bottom: 2rem;
  }

  .results-sub span {
    font-weight: 700;
    color: #4f46e5;
  }

  .btn-back {
    background: #f0f1f8;
    color: #4f46e5;
    border: none;
    border-radius: 14px;
    padding: 0.75rem 1.5rem;
    font-family: 'Sora', sans-serif;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.18s;
  }

  .btn-back:hover {
    background: #e0e2ef;
  }
`;


const shuffleArray = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
};

const Quizzes = () => {
    const { quizzes, deleteQuiz, generateStandaloneQuiz, markQuizCompleted } = useOutletContext();
    
    const [activeQuiz, setActiveQuiz] = useState(null);
    const [parsedQuestions, setParsedQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);

    const [isGenerating, setIsGenerating] = useState(false);
    const [showCustomModal, setShowCustomModal] = useState(false);
    const [customTopic, setCustomTopic] = useState('');
    const [customDiff, setCustomDiff] = useState('Medium');
    const [customCoverage, setCustomCoverage] = useState(''); 

    
    const checkIsCorrect = (option, resolvedAnswerText) => {
        if (!resolvedAnswerText) return false;
        return String(option).trim().toLowerCase() === String(resolvedAnswerText).trim().toLowerCase();
    };

    const handleStartQuiz = (quiz) => {
        try {
            let cleanJson = quiz.questions_json;
            if (typeof cleanJson === 'string') {
                cleanJson = cleanJson.replace(/```json/gi, '').replace(/```/g, '').trim();
            }
            let parsedData = typeof cleanJson === 'string' ? JSON.parse(cleanJson) : cleanJson;
            let questionsArray = [];

            if (Array.isArray(parsedData)) {
                questionsArray = parsedData;
            } else if (parsedData && typeof parsedData === 'object') {
                if (Array.isArray(parsedData.questions)) questionsArray = parsedData.questions;
                else if (Array.isArray(parsedData.quiz)) questionsArray = parsedData.quiz;
                else if (Array.isArray(parsedData.data)) questionsArray = parsedData.data;
                else Object.values(parsedData).forEach(val => { if (Array.isArray(val)) questionsArray = val; });
            }

            if (questionsArray?.length > 0) {
               
                const processedQuestions = questionsArray.map(q => {
                    let exactAnswerText = String(q.answer).trim().toLowerCase();
                    
                    if (q.options) {
                        q.options.forEach((opt, idx) => {
                            const cleanOpt = String(opt).trim().toLowerCase();
                            const letter = String.fromCharCode(65 + idx).toLowerCase();
                            if (cleanOpt === exactAnswerText || letter === exactAnswerText || exactAnswerText === `${letter}) ${cleanOpt}` || exactAnswerText === `${letter}. ${cleanOpt}`) {
                                exactAnswerText = cleanOpt; 
                            }
                        });
                    }

                    return {
                        ...q,
                        resolvedAnswer: exactAnswerText, // Save the bulletproof answer
                        options: q.options ? shuffleArray([...q.options]) : [] // Jumble the choices!
                    };
                });

                setParsedQuestions(processedQuestions);
                setActiveQuiz(quiz);
                setCurrentIndex(0);
                setScore(0);
                setShowResults(false);
                setSelectedAnswer(null);
            } else {
                alert("This quiz is empty or still generating! Try creating a new one.");
            }
        } catch {
            alert("Sorry, the AI had trouble formatting this quiz's content.");
        }
    };

    const handleAnswerSubmit = (option) => {
        setSelectedAnswer(option);
        setTimeout(() => {
            
            const isCorrect = checkIsCorrect(option, parsedQuestions[currentIndex].resolvedAnswer);
            const finalScore = isCorrect ? score + 1 : score;
            
            if (isCorrect) setScore(p => p + 1);
            
            if (currentIndex + 1 < parsedQuestions.length) {
                setCurrentIndex(p => p + 1);
                setSelectedAnswer(null);
            } else {
                setShowResults(true);
                
                if (markQuizCompleted) {
                    markQuizCompleted(activeQuiz.id, finalScore);
                }
            }
        }, 800);
    };

    const closeQuiz = () => { setActiveQuiz(null); setParsedQuestions([]); };

    const handleGenerateCustom = async (e) => {
        e.preventDefault();
        if (!customTopic.trim()) return;
        
        setIsGenerating(true);
       
        await generateStandaloneQuiz(customTopic, 5, customDiff, customCoverage);
        setIsGenerating(false);
        setShowCustomModal(false);
        setCustomTopic('');
        setCustomCoverage(''); // Reset
    };

    const handleRegenerate = async () => {
        setIsGenerating(true);
        const cleanTopic = activeQuiz.title.replace(/\s*\(.*?\)\s*/g, ''); 
        const nextDiff = score >= 4 ? 'Hard' : (score <= 2 ? 'Easy' : 'Medium');
        await generateStandaloneQuiz(cleanTopic, 5, nextDiff);
        setIsGenerating(false);
        closeQuiz(); 
    };

    return (
        <>
            <style>{styles}</style>
            <div className="quizzes-wrapper">
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    <div>
                        <h2 className="quiz-page-title">My Quizzes</h2>
                        <p className="quiz-page-sub">Test your knowledge on your generated study materials.</p>
                    </div>
                    <button className="btn-start-quiz" style={{ maxWidth: '200px' }} onClick={() => setShowCustomModal(true)}>
                        <i className="bi bi-plus-circle"></i> Custom Quiz
                    </button>
                </div>

                {quizzes?.length > 0 ? (
                    <Row className="g-4">
                        {quizzes.map(quiz => (
                            <Col md={6} lg={4} key={quiz.id}>
                                <div className="quiz-card">
                                    <div className="quiz-card-top">
                                        <div className="quiz-icon-wrap">🧠</div>
                                        
                                        {quiz.status === 'Completed' ? (
                                            <span className="quiz-badge-new" style={{background: '#d1fae5', color: '#065f46'}}>
                                                Score: {quiz.lastScore} / {parsedQuestions.length || 5}
                                            </span>
                                        ) : (
                                            <span className="quiz-badge-new">New</span>
                                        )}
                                        
                                    </div>
                                    <div>
                                        <h4 className="quiz-card-title">{quiz.title}</h4>
                                    </div>
                                    <p className="quiz-card-desc">
                                        A knowledge check to test your understanding of the material.
                                    </p>
                                    <div className="quiz-card-footer">
                                        <button className="btn-start-quiz" onClick={() => handleStartQuiz(quiz)}>
                                            <i className={quiz.status === 'Completed' ? "bi bi-arrow-repeat" : "bi bi-play-fill"}></i> 
                                            {quiz.status === 'Completed' ? ' Retake Quiz' : ' Start Quiz'}
                                        </button>
                                        <button className="btn-delete-quiz" onClick={() => deleteQuiz(quiz.id)}>
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                ) : (
                    <div className="empty-state">
                        <div className="empty-icon-wrap">
                            <i className="bi bi-ui-checks" style={{ color: '#4f46e5' }}></i>
                        </div>
                        <div className="empty-title">No Quizzes Yet</div>
                        <p className="empty-sub">Generate study discussions inside your AI Tutor page to view your knowledge check cards here!</p>
                    </div>
                )}
            </div>

            <Modal show={showCustomModal} onHide={() => !isGenerating && setShowCustomModal(false)} centered className="quiz-modal">
                <Modal.Header closeButton={!isGenerating}>
                    <Modal.Title>Create Custom Quiz</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleGenerateCustom}>
                        <Form.Group className="mb-4">
                            <Form.Label className="quiz-q-label">TOPIC</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="e.g. World War 2, Python basics..." 
                                value={customTopic}
                                onChange={(e) => setCustomTopic(e.target.value)}
                                className="py-2"
                                required
                            />
                        </Form.Group>
                        
                        {/*  */}
                        <Form.Group className="mb-4">
                            <Form.Label className="quiz-q-label">COVERAGE / OUTLINE (OPTIONAL)</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows={2}
                                placeholder="e.g. Only cover the Pacific Theater. Do not ask about Europe." 
                                value={customCoverage}
                                onChange={(e) => setCustomCoverage(e.target.value)}
                                className="py-2"
                                style={{ resize: 'none' }}
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label className="quiz-q-label">DIFFICULTY</Form.Label>
                            <Form.Select 
                                value={customDiff} 
                                onChange={(e) => setCustomDiff(e.target.value)}
                                className="py-2"
                            >
                                <option value="Easy">Easy (Beginner concepts)</option>
                                <option value="Medium">Medium (Standard testing)</option>
                                <option value="Hard">Hard (Deep critical thinking)</option>
                            </Form.Select>
                        </Form.Group>
                        <button type="submit" className="btn-start-quiz w-100 py-3 mt-2" disabled={isGenerating || !customTopic.trim()}>
                            {isGenerating ? <><Spinner size="sm" className="me-2"/> Generating AI Quiz...</> : 'Generate Now'}
                        </button>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={activeQuiz !== null} onHide={closeQuiz} size="lg" centered backdrop="static" className="quiz-modal">
                <Modal.Header closeButton>
                    <Modal.Title>{activeQuiz?.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {!showResults ? (
                        <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span className="quiz-q-label">Question {currentIndex + 1} / {parsedQuestions.length}</span>
                                <span className="quiz-score-label">Score: {score}</span>
                            </div>
                            <div className="quiz-progress">
                                <div
                                    className="quiz-progress-bar"
                                    style={{ width: `${((currentIndex + 1) / parsedQuestions.length) * 100}%` }}
                                />
                            </div>
                            <div className="quiz-question-text">{parsedQuestions[currentIndex]?.question}</div>
                            <div>
                                {parsedQuestions[currentIndex]?.options?.map((option, idx) => {
                                    let cls = 'quiz-option-btn';
                                    if (selectedAnswer) {
                                        
                                        const isCorrect = checkIsCorrect(option, parsedQuestions[currentIndex].resolvedAnswer);
                                        if (isCorrect) cls += ' correct';
                                        else if (option === selectedAnswer) cls += ' wrong';
                                    }
                                    return (
                                        <button
                                            key={idx}
                                            className={cls}
                                            onClick={() => !selectedAnswer && handleAnswerSubmit(option)}
                                            disabled={selectedAnswer !== null}
                                        >
                                            <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
                                            {option}
                                        </button>
                                    );
                                })}
                            </div>
                        </>
                    ) : (
                        <div className="results-wrap">
                            <div className="results-trophy">🏆</div>
                            <div className="results-title">Quiz Completed!</div>
                            <p className="results-sub">
                                You scored <span>{score}</span> out of {parsedQuestions.length}
                            </p>
                            
                            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                                <button className="btn-back" onClick={closeQuiz}>Dashboard</button>
                                
                                <button className="btn-start-quiz" style={{ flex: 'none', padding: '0.75rem 1.5rem' }} onClick={handleRegenerate} disabled={isGenerating}>
                                    {isGenerating ? <Spinner size="sm" /> : <><i className="bi bi-arrow-repeat"></i> Generate Another</>}
                                </button>
                            </div>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        </>
    );
};

export default Quizzes;