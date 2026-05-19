import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2'; 
import robotImg from '../assets/Welcome.png'; 

const SignupPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); 
    
    try {
      const response = await fetch('https://master-athena-final-project.onrender.com/api/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            username, 
            email, 
            password, 
            first_name: firstName, 
            last_name: lastName 
        })
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          title: 'Account Created!',
          text: 'Welcome to Athena! You can now log in.',
          icon: 'success',
          confirmButtonColor: '#135cce',
          customClass: { popup: 'rounded-5' }
        }).then(() => {
          navigate('/login'); 
        });

      } else {
        Swal.fire({
          title: 'Oops...',
          text: data.error || "Something went wrong. Username might be taken.",
          icon: 'error',
          confirmButtonColor: '#135cce'
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      Swal.fire({
        title: 'Connection Error',
        text: 'Failed to connect to the server.',
        icon: 'warning',
        confirmButtonColor: '#135cce'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="vh-100 d-flex align-items-center justify-content-center bg-light" style={{ overflow: 'hidden' }}>
      <Container>
        <Row className="justify-content-center">
          <Col lg={10} xl={9}>
            <Card className="border-0 shadow-lg rounded-5 overflow-hidden">
              <Row className="g-0 flex-row-reverse"> 
                <Col md={6} className="p-4 p-sm-5 d-flex flex-column justify-content-center bg-white">
                  <div className="text-center mb-4 mt-2">
                    <h2 className="fw-bold text-primary mb-2" style={{ letterSpacing: '1px' }}>Sign Up</h2>
                    <p className="text-muted">Create your Athena account</p>
                  </div>

                  <Form onSubmit={handleSubmit} className="px-sm-4">
                    
                    {/* Side-by-side First and Last Name Inputs */}
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold text-dark">First Name<span className="text-danger">*</span></Form.Label>
                          <Form.Control type="text" className="py-2 px-3 rounded-4 shadow-sm border-light" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold text-dark">Last Name<span className="text-danger">*</span></Form.Label>
                          <Form.Control type="text" className="py-2 px-3 rounded-4 shadow-sm border-light" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                        </Form.Group>
                      </Col>
                    </Row>

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

                    <Button variant="primary" type="submit" className="w-100 py-3 rounded-pill fw-bold shadow-sm mb-4" disabled={isLoading}>
                      {isLoading ? (
                        <><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" /> Connecting to Server...</>
                      ) : (
                        'Create Account'
                      )}
                    </Button>
                    
                    <div className="text-center mb-2">
                      <small className="text-muted fw-semibold">
                        Already have an account? <Link to="/login" className="text-primary text-decoration-none ms-1 hover-primary">Login</Link>
                      </small>
                    </div>
                  </Form>
                </Col>

                <Col md={6} className="d-none d-md-flex align-items-center justify-content-center" style={{ backgroundColor: '#135cce', minHeight: '500px' }}>
                  <img src={robotImg} alt="Athena Robot" className="img-fluid p-5" style={{ maxHeight: '100%', objectFit: 'contain', animation: 'float 3s ease-in-out infinite' }} />
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