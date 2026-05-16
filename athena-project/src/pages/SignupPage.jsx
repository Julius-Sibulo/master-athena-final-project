import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import robotImg from '../assets/Welcome.png'; 

const SignupPage = () => {
  const [username, setUsername] = useState(''); // NEW!
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  // --- NEW: Sends data to Django to create the account! ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('https://master-athena-final-project.onrender.com/api/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, name })
      });

      const data = await response.json();

      if (response.ok) {
        alert("Account created successfully! You can now log in.");
        navigate('/login'); 
      } else {
        alert(data.error || "Something went wrong. Username might be taken.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Failed to connect to the server.");
    }
  };

  return (
    <div className="vh-100 d-flex align-items-center justify-content-center bg-light" style={{ overflow: 'hidden' }}>
      <Container>
        <Row className="justify-content-center">
          <Col lg={10} xl={9}>
            <Card className="border-0 shadow-lg rounded-5 overflow-hidden">
              <Row className="g-0 flex-row-reverse"> 
                
                {/* RIGHT SIDE: The Form */}
                <Col md={6} className="p-4 p-sm-5 d-flex flex-column justify-content-center bg-white">
                  <div className="text-center mb-4 mt-2">
                    <h2 className="fw-bold text-primary mb-2" style={{ letterSpacing: '1px' }}>Sign Up</h2>
                    <p className="text-muted">Create your Athena account</p>
                  </div>

                  <Form onSubmit={handleSubmit} className="px-sm-4">
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold text-dark">Full Name<span className="text-danger">*</span></Form.Label>
                      <Form.Control type="text" className="py-2 px-3 rounded-4 shadow-sm border-light" value={name} onChange={(e) => setName(e.target.value)} required />
                    </Form.Group>

                    {/* NEW: Username Field */}
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold text-dark">Username<span className="text-danger">*</span></Form.Label>
                      <Form.Control type="text" className="py-2 px-3 rounded-4 shadow-sm border-light" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold text-dark">Email<span className="text-danger">*</span></Form.Label>
                      <Form.Control type="email" className="py-2 px-3 rounded-4 shadow-sm border-light" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold text-dark">Password<span className="text-danger">*</span></Form.Label>
                      <Form.Control type="password" className="py-2 px-3 rounded-4 shadow-sm border-light" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </Form.Group>

                    <Button variant="primary" type="submit" className="w-100 py-3 rounded-pill fw-bold shadow-sm mb-4">
                      Create Account
                    </Button>
                    
                    <div className="text-center mb-2">
                      <small className="text-muted fw-semibold">
                        Already have an account? <Link to="/login" className="text-primary text-decoration-none ms-1 hover-primary">Login</Link>
                      </small>
                    </div>
                  </Form>
                </Col>

                {/* LEFT SIDE: The Robot Image Area */}
                <Col md={6} className="d-none d-md-flex align-items-center justify-content-center" style={{ backgroundColor: '#135cce', minHeight: '500px' }}>
                  <img 
                    src={robotImg} 
                    alt="Athena Robot" 
                    className="img-fluid p-5" 
                    style={{ maxHeight: '100%', objectFit: 'contain', animation: 'float 3s ease-in-out infinite' }} 
                  />
                </Col>

              </Row>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SignupPage;