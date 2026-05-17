import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Button, Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';


import robotImg from '../assets/hello.png';

const FadeInSection = ({ children, delay = '0s' }) => {
    const [isVisible, setVisible] = useState(false);
    const domRef = useRef();

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    
                    observer.unobserve(domRef.current);
                }
            });
        }, { threshold: 0.15 }); 

        const currentRef = domRef.current;
        if (currentRef) observer.observe(currentRef);
        
        return () => {
            if (currentRef) observer.unobserve(currentRef);
        };
    }, []);

    return (
        <div
            ref={domRef}
            className={`fade-in-section ${isVisible ? 'is-visible' : ''}`}
            style={{ transitionDelay: delay }}
        >
            {children}
        </div>
    );
};


const LandingPage = () => {
    const primaryBlue = '#145edb';
    const darkBlue = '#0a3a8c';

    return (
        <div className="bg-white min-vh-100 font-sans" style={{ overflowX: 'hidden' }}>
            
            {/* INJECTED CSS FOR ANIMATIONS & HOVERS */}
            <style>{`
                /* Floating animation for the robot */
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                    100% { transform: translateY(0px); }
                }
                .hero-image {
                    animation: float 4s ease-in-out infinite;
                }

                /* Fade-in scroll behavior */
                .fade-in-section {
                    opacity: 0;
                    transform: translateY(30px);
                    transition: opacity 0.8s ease-out, transform 0.8s ease-out;
                    will-change: opacity, visibility;
                }
                .fade-in-section.is-visible {
                    opacity: 1;
                    transform: translateY(0);
                }

                /* Interactive Card Hovers */
                .feature-card {
                    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease;
                }
                .feature-card:hover {
                    transform: translateY(-12px);
                    box-shadow: 0 15px 35px rgba(20, 94, 219, 0.15) !important;
                }
                
                /* Gradient Text Utility */
                .text-gradient {
                    background: linear-gradient(135deg, ${primaryBlue}, #4facfe);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
            `}</style>

            {/* HERO SECTION WITH GRADIENT & CURVED BOTTOM */}
            <div 
                style={{ 
                    background: `linear-gradient(135deg, ${primaryBlue} 0%, ${darkBlue} 100%)`, 
                    borderBottomLeftRadius: '50% 8%', 
                    borderBottomRightRadius: '50% 8%',
                    paddingBottom: '7rem',
                    position: 'relative',
                    boxShadow: '0 10px 30px rgba(10, 58, 140, 0.3)'
                }}
            >
                {/* Navbar Area */}
                <Container className="pt-4">
                    <div className="d-flex justify-content-between align-items-center mb-5">
                        <div className="d-flex align-items-center text-white" style={{ cursor: 'pointer' }}>
                            <div className="bg-white text-primary rounded-circle d-flex justify-content-center align-items-center me-2 shadow-sm" style={{ width: '40px', height: '40px' }}>
                                <i className="bi bi-robot fs-5"></i>
                            </div>
                            <h4 className="fw-bolder m-0" style={{ letterSpacing: '1.5px' }}>ATHENA</h4>
                        </div>
                        <Link to="/login">
                            <Button variant="outline-light" className="rounded-pill px-4 py-2 fw-bold border-2 transition-all hover-white">
                                Login
                            </Button>
                        </Link>
                    </div>
                </Container>

                {/* Hero Content Area */}
                <Container>
                    <Row className="align-items-center">
                        <Col lg={6} className="text-white pe-lg-5 mb-5 mb-lg-0 text-center text-lg-start z-1">
                            <FadeInSection>
                                <Badge bg="light" text="primary" className="mb-3 px-3 py-2 rounded-pill fw-bold shadow-sm">
                                    <i className="bi bi-sparkles me-1"></i> The Future of Learning
                                </Badge>
                                <h1 className="fw-bolder mb-4 display-4" style={{ lineHeight: '1.15', letterSpacing: '-1px' }}>
                                    Automated Tutor for<br />
                                    <span className="text-warning">Helping Educational</span><br />
                                    Needs in Academics
                                </h1>
                                <p className="fs-5 mb-5 fw-light opacity-75" style={{ maxWidth: '500px' }}>
                                    Experience personalized tutoring powered by artificial intelligence. Learn at your own pace, anytime, anywhere.
                                </p>
                                <Link to="/signup">
                                    <Button variant="light" className="text-primary rounded-pill px-5 py-3 fw-bolder shadow-lg fs-5 d-inline-flex align-items-center gap-2" style={{ transition: 'transform 0.2s' }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                                        Get Started Free <i className="bi bi-arrow-right"></i>
                                    </Button>
                                </Link>
                            </FadeInSection>
                        </Col>
                        
                        <Col lg={6} className="text-center position-relative">
                            <FadeInSection delay="0.2s">
                                {/* Soft glow behind the robot */}
                                <div className="position-absolute top-50 start-50 translate-middle rounded-circle" style={{ width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)', zIndex: 0 }}></div>
                                <img 
                                    src={robotImg} 
                                    alt="Athena Robot" 
                                    className="img-fluid hero-image position-relative z-1"
                                    style={{ maxHeight: '480px', objectFit: 'contain', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.2))' }}
                                />
                            </FadeInSection>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* FEATURES SECTION */}
            <Container className="py-5 mt-5">
                <FadeInSection>
                    <div className="text-center mb-5 pb-3">
                        <h6 className="fw-bold text-uppercase" style={{ color: '#4facfe', letterSpacing: '2px' }}>Core Features</h6>
                        <h2 className="fw-bolder display-6 text-dark mb-3">A Buddy for Everybody</h2>
                        <p className="text-muted mx-auto" style={{ maxWidth: '650px', fontSize: '1.05rem', lineHeight: '1.6' }}>
                            ATHENA provides students with real-time academic support, adaptive learning resources, and intelligent assessments designed to close learning gaps.
                        </p>
                    </div>
                </FadeInSection>

                <Row className="g-4 px-lg-4">
                    {/* Feature 1 */}
                    <Col md={4}>
                        <FadeInSection delay="0.1s">
                            <Card className="h-100 border-0 bg-white rounded-4 text-center position-relative mt-4 shadow-sm feature-card">
                                <div 
                                    className="position-absolute top-0 start-50 translate-middle rounded-circle text-white d-flex justify-content-center align-items-center shadow-lg" 
                                    style={{ width: '70px', height: '70px', background: `linear-gradient(135deg, ${primaryBlue}, #4facfe)` }}
                                >
                                    <i className="bi bi-person-badge fs-3"></i>
                                </div>
                                <Card.Body className="pt-5 px-4 pb-4 mt-3">
                                    <h5 className="fw-bold mb-3 text-dark">User Management<br />Module</h5>
                                    <p className="text-muted small mb-0 lh-lg">
                                        Securely manages student and administrator accounts, ensuring personalized access and data privacy for every session.
                                    </p>
                                </Card.Body>
                            </Card>
                        </FadeInSection>
                    </Col>

                    {/* Feature 2 */}
                    <Col md={4}>
                        <FadeInSection delay="0.2s">
                            <Card className="h-100 border-0 bg-white rounded-4 text-center position-relative mt-4 shadow-sm feature-card">
                                <div 
                                    className="position-absolute top-0 start-50 translate-middle rounded-circle text-white d-flex justify-content-center align-items-center shadow-lg" 
                                    style={{ width: '70px', height: '70px', background: `linear-gradient(135deg, #8E2DE2, #4A00E0)` }}
                                >
                                    <i className="bi bi-journals fs-3"></i>
                                </div>
                                <Card.Body className="pt-5 px-4 pb-4 mt-3">
                                    <h5 className="fw-bold mb-3 text-dark">Learning Content<br />Module</h5>
                                    <p className="text-muted small mb-0 lh-lg">
                                        Dynamically organizes and delivers structured lessons and study materials to support your unique adaptive learning path.
                                    </p>
                                </Card.Body>
                            </Card>
                        </FadeInSection>
                    </Col>

                    {/* Feature 3 */}
                    <Col md={4}>
                        <FadeInSection delay="0.3s">
                            <Card className="h-100 border-0 bg-white rounded-4 text-center position-relative mt-4 shadow-sm feature-card">
                                <div 
                                    className="position-absolute top-0 start-50 translate-middle rounded-circle text-white d-flex justify-content-center align-items-center shadow-lg" 
                                    style={{ width: '70px', height: '70px', background: `linear-gradient(135deg, #11998e, #38ef7d)` }}
                                >
                                    <i className="bi bi-clipboard2-data fs-3"></i>
                                </div>
                                <Card.Body className="pt-5 px-4 pb-4 mt-3">
                                    <h5 className="fw-bold mb-3 text-dark">Assessment &<br />Feedback</h5>
                                    <p className="text-muted small mb-0 lh-lg">
                                        Provides intelligent quizzes and tests with real-time, constructive feedback to evaluate understanding and reinforce mastery.
                                    </p>
                                </Card.Body>
                            </Card>
                        </FadeInSection>
                    </Col>
                </Row>
            </Container>

            {/* ABOUT SECTION */}
            <div className="bg-light mt-5">
                <Container className="py-5 my-4">
                    <FadeInSection>
                        <div className="text-center mx-auto" style={{ maxWidth: '800px' }}>
                            <div className="d-inline-flex align-items-center justify-content-center bg-white rounded-circle shadow-sm mb-4" style={{ width: '80px', height: '80px' }}>
                                <i className="bi bi-info-circle text-primary fs-1"></i>
                            </div>
                            <h2 className="fw-bolder mb-4 text-dark display-6">What is <span className="text-gradient">ATHENA?</span></h2>
                            <p className="text-muted lh-lg fs-6">
                                ATHENA's primary purpose is to create an automated, internet-based, intelligent tutoring system that provides students with personalized assistance for addressing learning gaps in both literacy and elementary subject mastery. By integrating cutting-edge artificial intelligence, adaptive learning technologies, and interactive web-based educational materials, we ensure that every student receives an effective and accessible learning experience tailored just for them.
                            </p>
                        </div>
                    </FadeInSection>
                </Container>
            </div>

        </div>
    );
};

export default LandingPage;