import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';


const HireJose = ({ show, onClose }) => {
    
    
    if (!show) return null;

    return (
        <div 
            className="jumpscare-overlay d-flex align-items-center justify-content-center"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.95)',
                zIndex: 99999, 
                animation: 'flashBackground 0.5s infinite alternate'
            }}
        >
            <style>{`
                @keyframes flashBackground {
                    0% { backgroundColor: rgba(0, 0, 0, 0.95); }
                    100% { backgroundColor: rgba(20, 0, 0, 0.98); }
                }
                @keyframes shakeCard {
                    0% { transform: translate(1px, 1px) rotate(0deg); }
                    10% { transform: translate(-1px, -2px) rotate(-1deg); }
                    20% { transform: translate(-3px, 0px) rotate(1deg); }
                    30% { transform: translate(3px, 2px) rotate(0deg); }
                    40% { transform: translate(1px, -1px) rotate(1deg); }
                    50% { transform: translate(-1px, 2px) rotate(-1deg); }
                    60% { transform: translate(-3px, 1px) rotate(0deg); }
                    70% { transform: translate(3px, 1px) rotate(-1deg); }
                    80% { transform: translate(-1px, -1px) rotate(1deg); }
                    90% { transform: translate(1px, 2px) rotate(0deg); }
                    100% { transform: translate(1px, -2px) rotate(-1deg); }
                }
                .glitch-text {
                    font-size: 3rem;
                    font-weight: 900;
                    color: #ff0000;
                    text-transform: uppercase;
                    text-shadow: 3px 3px 0px #00ffff, -3px -3px 0px #ff00ff;
                }
                .crazy-card {
                    animation: shakeCard 0.4s infinite;
                    border: 5px solid red;
                    box-shadow: 0 0 50px red;
                }
            `}</style>

            <Container>
                <Row className="justify-content-center">
                    <Col md={8} lg={6}>
                        <Card className="crazy-card bg-dark text-white rounded-4 text-center p-5">
                            <h1 className="glitch-text mb-4">🚨 SYSTEM OVERRIDE 🚨</h1>
                            
                            <h2 className="fw-bold text-warning mb-3">
                                GENIUS FULL-STACK DEVELOPER DETECTED
                            </h2>
                            
                            <p className="fs-5 mb-4">
                                You have clicked the notification bell. <br/>
                                Therefore, you must hire <strong className="text-info fs-4">JOSE BATUMBAKAL</strong> immediately.
                            </p>

                            <div className="bg-black border border-secondary rounded-3 p-3 mb-4 text-start font-monospace text-success">
                                &gt; SKILLS LOADED: React, Django, PostgreSQL, AI Integration, Bug Squashing<br/>
                                &gt; SLEEP DEPRAVATION: 100%<br/>
                                &gt; COFFEE LEVELS: Critical
                            </div>

                            <div className="d-flex flex-column gap-3">
                                <Button 
                                    variant="danger" 
                                    size="lg" 
                                    className="fw-bold py-3 text-uppercase border-0"
                                    style={{ background: 'linear-gradient(45deg, #ff0000, #ff8c00)' }}
                                    onClick={() => window.open('https://juliussibulo.github.io/Trends-Repository-25-26/Recitation2_Sibulo.html', '_blank')}
                                >
                                    ⚠️ View My Resume ⚠️
                                </Button>
                                
                                <Button 
                                    variant="outline-light" 
                                    className="fw-bold"
                                    onClick={onClose} 
                                >
                                    I am foolish and will not hire him (Close)
                                </Button>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default HireJose;