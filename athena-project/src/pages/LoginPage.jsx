import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import robotImg from '../assets/Welcome.png'; 

const LoginPage = ({ onLogin }) => {
  // ✨ FIX 1: Set initial state to empty strings so it doesn't default to 'admin'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    setError('');
    setIsSubmitting(true);

    try {
      const success = await onLogin(username, password);
      
      if (success) {
        navigate('/dashboard/home');
      } else {
        setError("Invalid credentials! Please try again.");
      }
    } catch (err) {
      setError("Connection refused. Is your Django server running?");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="vh-100 d-flex align-items-center justify-content-center bg-light" style={{ overflow: 'hidden' }}>
      <Container>
        <Row className="justify-content-center">
          <Col lg={10} xl={9}>
            <Card className="border-0 shadow-lg rounded-5 overflow-hidden">
              <Row className="g-0">
                
                {/* LEFT SIDE: The Form */}
                <Col md={6} className="p-4 p-sm-5 d-flex flex-column justify-content-center bg-white">
                  <div className="text-center mb-5 mt-3">
                    <h2 className="fw-bold text-primary mb-2" style={{ letterSpacing: '1px' }}>Login</h2>
                    <p className="text-muted">Welcome back to Athena</p>
                  </div>

                  {error && <Alert variant="danger" className="rounded-4 small">{error}</Alert>}

                  <Form onSubmit={handleSubmit} className="px-sm-4">
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold text-dark">Username<span className="text-danger">*</span></Form.Label>
                      <Form.Control 
                        type="text" 
                        placeholder="Enter your username" // ✨ FIX 2: Added placeholder
                        autoComplete="off" // ✨ FIX 3: Tells Chrome to stop autofilling
                        className="py-2 px-3 rounded-4 shadow-sm border-light" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required 
                        disabled={isSubmitting}
                      />
                    </Form.Group>

                    <Form.Group className="mb-5">
                      <Form.Label className="fw-semibold text-dark">Password<span className="text-danger">*</span></Form.Label>
                      <Form.Control 
                        type="password" 
                        placeholder="Enter your password" // ✨ FIX 2: Added placeholder
                        autoComplete="new-password" // ✨ FIX 3: The ultimate trick to block password autofill
                        className="py-2 px-3 rounded-4 shadow-sm border-light" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                        disabled={isSubmitting}
                      />
                    </Form.Group>

                    <Button 
                      variant="primary" 
                      type="submit" 
                      className="w-100 py-3 rounded-pill fw-bold shadow-sm mb-4 d-flex justify-content-center align-items-center"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? <Spinner animation="border" size="sm" className="me-2" /> : 'Login'}
                    </Button>
                    
                    <div className="text-center mb-3">
                      <small className="text-muted fw-semibold">
                        Don't have an account? <Link to="/signup" className="text-primary text-decoration-none ms-1 hover-primary">Create an Account</Link>
                      </small>
                    </div>
                  </Form>
                </Col>

                {/* RIGHT SIDE: The Robot Image Area */}
                <Col md={6} className="d-none d-md-flex align-items-center justify-content-center" style={{ backgroundColor: '#135cce', minHeight: '500px' }}>
                  <img 
                    src={robotImg} 
                    alt="Athena Robot" 
                    className="img-fluid p-5" 
                    style={{ maxHeight: '100%', objectFit: 'contain', animation: 'float 3s ease-in-out infinite' }} 
                  />
                  
                  <style>{`
                    @keyframes float {
                      0% { transform: translateY(0px); }
                      50% { transform: translateY(-15px); }
                      100% { transform: translateY(0px); }
                    }
                  `}</style>
                </Col>

              </Row>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginPage;