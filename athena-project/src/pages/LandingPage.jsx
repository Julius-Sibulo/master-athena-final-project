import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// IMPORT YOUR IMAGE HERE:
import robotImg from '../assets/hello.png';

const LandingPage = () => {
    // Colors matching your design
    const primaryBlue = '#145edb'; 

    return (
        <div className="bg-white min-vh-100 font-sans">
            
            {/* HERO SECTION WITH CURVED BOTTOM */}
            <div 
                style={{ 
                    backgroundColor: primaryBlue, 
                    borderBottomLeftRadius: '50% 8%', 
                    borderBottomRightRadius: '50% 8%',
                    paddingBottom: '6rem'
                }}
            >
                {/* Navbar Area */}
                <Container className="pt-4">
                    <div className="d-flex justify-content-between align-items-center mb-5">
                        <div className="d-flex align-items-center text-white">
                            <i className="bi bi-robot fs-3 me-2"></i> 
                            <h4 className="fw-bold m-0" style={{ letterSpacing: '1px' }}>ATHENA</h4>
                        </div>
                        <Link to="/login">
                            <Button variant="outline-light" className="rounded-pill px-4 fw-semibold border-2" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                                Login
                            </Button>
                        </Link>
                    </div>
                </Container>

                {/* Hero Content Area */}
                <Container>
                    <Row className="align-items-center">
                        <Col lg={6} className="text-white pe-lg-5 mb-5 mb-lg-0 text-center text-lg-start">
                            <h1 className="fw-bold mb-4 display-5" style={{ lineHeight: '1.2' }}>
                                ATHENA:<br />
                                Automated Tutor for<br />
                                Helping Educational<br />
                                Needs in Academics
                            </h1>
                            <p className="fs-5 mb-4 fw-light opacity-75">
                                Personalized tutoring with AI.<br />
                                Learn anytime, anywhere.
                            </p>
                            <Link to="/signup">
                                <Button variant="light" className="text-primary rounded-pill px-5 py-2 fw-bold shadow-sm fs-5">
                                    Sign Up
                                </Button>
                            </Link>
                        </Col>
                        <Col lg={6} className="text-center">
                            <div className="position-relative d-inline-block">
                                {/* USING YOUR ACTUAL IMAGE HERE */}
                                <img 
                                    src={robotImg} 
                                    alt="Athena Robot" 
                                    className="img-fluid"
                                    style={{ maxHeight: '450px', objectFit: 'contain' }}
                                />
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* FEATURES SECTION */}
            <Container className="py-5 mt-4">
                <div className="text-center mb-5 mt-3">
                    <h2 className="fw-bold" style={{ color: primaryBlue }}>A Buddy for Everybody</h2>
                    <p className="text-muted mx-auto" style={{ maxWidth: '600px', fontSize: '0.9rem' }}>
                        ATHENA will provide students with real-time academic support, interactive learning resources, and assessments.
                    </p>
                </div>

                <Row className="g-4 px-lg-5">
                    {/* Feature 1 */}
                    <Col md={4}>
                        <Card className="h-100 border-0 bg-light rounded-4 text-center position-relative mt-4 shadow-sm">
                            <div 
                                className="position-absolute top-0 start-50 translate-middle rounded-circle text-white d-flex justify-content-center align-items-center shadow" 
                                style={{ width: '60px', height: '60px', backgroundColor: primaryBlue }}
                            >
                                <i className="bi bi-file-earmark-person fs-3"></i>
                            </div>
                            <Card.Body className="pt-5 px-4 pb-4">
                                <h5 className="fw-bold mb-3" style={{ color: '#3b4363' }}>
                                    User Management<br />Module<br />(UMM)
                                </h5>
                                <p className="text-muted small mb-0">
                                    Manages student and administrator accounts, ensuring secure login and personalized access.
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Feature 2 */}
                    <Col md={4}>
                        <Card className="h-100 border-0 bg-light rounded-4 text-center position-relative mt-4 shadow-sm">
                            <div 
                                className="position-absolute top-0 start-50 translate-middle rounded-circle text-white d-flex justify-content-center align-items-center shadow" 
                                style={{ width: '60px', height: '60px', backgroundColor: primaryBlue }}
                            >
                                <i className="bi bi-calendar3 fs-4"></i>
                            </div>
                            <Card.Body className="pt-5 px-4 pb-4">
                                <h5 className="fw-bold mb-3" style={{ color: '#3b4363' }}>
                                    Learning Content<br />Module<br />(LCM)
                                </h5>
                                <p className="text-muted small mb-0">
                                    Organizes and delivers structured lessons and study materials to support adaptive learning.
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Feature 3 */}
                    <Col md={4}>
                        <Card className="h-100 border-0 bg-light rounded-4 text-center position-relative mt-4 shadow-sm">
                            <div 
                                className="position-absolute top-0 start-50 translate-middle rounded-circle text-white d-flex justify-content-center align-items-center shadow" 
                                style={{ width: '60px', height: '60px', backgroundColor: primaryBlue }}
                            >
                                <i className="bi bi-people-fill fs-3"></i>
                            </div>
                            <Card.Body className="pt-5 px-4 pb-4">
                                <h5 className="fw-bold mb-3" style={{ color: '#3b4363' }}>
                                    Assessment and<br />Feedback Module<br />(AFM)
                                </h5>
                                <p className="text-muted small mb-0">
                                    Provides quizzes and tests with real-time feedback to evaluate understanding and reinforce learning.
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* ABOUT SECTION */}
            <Container className="py-5 mb-5">
                <div className="text-center mx-auto" style={{ maxWidth: '800px' }}>
                    <h2 className="fw-bold mb-4" style={{ color: primaryBlue }}>What is ATHENA?</h2>
                    <p className="text-muted lh-lg" style={{ fontSize: '0.95rem' }}>
                        ATHENA's primary purpose is to create an automated, internet-based, intelligent tutoring system that provides students with personalized assistance for addressing learning gaps in both literacy and elementary subject mastery. In order to develop a system that will provide effective and accessible learning experiences, ATHENA will integrate artificial intelligence, adaptive learning technologies, and interactive web-based educational materials.
                    </p>
                </div>
            </Container>

        </div>
    );
};

export default LandingPage;