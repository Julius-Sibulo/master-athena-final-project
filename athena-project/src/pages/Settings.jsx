import React, { useState, useRef } from 'react';
import { Container, Card, Button, Form, Alert, Badge, Row, Col, Modal, Spinner } from 'react-bootstrap';
import { useOutletContext, useNavigate } from 'react-router-dom';

const Settings = () => {
    const { currentUser, updateUser, onLogout, lessons } = useOutletContext();
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(currentUser?.name || currentUser?.username || '');
    const [email, setEmail] = useState(currentUser?.email || '');
    
    const [isLoading, setIsLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState(null);
    const fileInputRef = useRef(null);

    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordError, setPasswordError] = useState(null);
    const [passwordSuccess, setPasswordSuccess] = useState(null);
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2000000) { 
                setStatusMessage({ type: 'danger', text: 'Image must be under 2MB.' });
                return;
            }
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64Avatar = reader.result;
                await handleSaveChanges(base64Avatar, name, email);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveChanges = async (newAvatar = currentUser?.avatar, newName = name, newEmail = email) => {
        setIsLoading(true);
        setStatusMessage(null);

        try {
            const response = await fetch('https://master-athena-final-project.onrender.com/api/register//api/update-profile/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: currentUser.id,
                    name: newName,
                    email: newEmail,
                    bio: currentUser?.bio || '', 
                    avatar: newAvatar
                })
            });

            const data = await response.json();

            if (response.ok) {
                updateUser({
                    name: data.name || newName,
                    email: newEmail,
                    avatar: data.avatar || newAvatar
                });
                setStatusMessage({ type: 'success', text: 'Profile updated successfully!' });
                setIsEditing(false); 
            } else {
                setStatusMessage({ type: 'danger', text: data.error || 'Failed to update profile.' });
            }
        } catch (error) {
            setStatusMessage({ type: 'danger', text: 'Server connection error.' });
        } finally {
            setIsLoading(false);
        }
    };

    const submitPasswordChange = async (e) => {
        e.preventDefault();
        setPasswordError(null);
        setPasswordSuccess(null);

        if (!passwords.current || !passwords.new || !passwords.confirm) {
            setPasswordError("Please fill out all password fields.");
            return;
        }
        if (passwords.new !== passwords.confirm) {
            setPasswordError("New passwords do not match.");
            return;
        }
        if (passwords.new.length < 6) {
            setPasswordError("New password must be at least 6 characters long.");
            return;
        }

        setIsChangingPassword(true);

        try {
            const response = await fetch('https://master-athena-final-project.onrender.com/api/register//api/change-password/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: currentUser.id,
                    current_password: passwords.current,
                    new_password: passwords.new
                })
            });

            const data = await response.json();

            if (response.ok) {
                setPasswordSuccess("Password successfully updated!");
                setPasswords({ current: '', new: '', confirm: '' });
                setTimeout(() => {
                    setShowPasswordModal(false);
                    setPasswordSuccess(null);
                }, 2000); 
            } else {
                setPasswordError(data.error || 'Failed to change password.');
            }
        } catch (error) {
            setPasswordError('Server connection error.');
        } finally {
            setIsChangingPassword(false);
        }
    };

    const closePasswordModal = () => {
        setShowPasswordModal(false);
        setPasswords({ current: '', new: '', confirm: '' });
        setPasswordError(null);
        setPasswordSuccess(null);
    };

    return (
        // THE FIX: Strict height lock to banish scrollbars, but content sizes are restored to normal
        <Container fluid className="p-4 overflow-hidden" style={{ height: 'calc(100vh - 110px)', backgroundColor: '#fcfcfc' }}>
            <div className="mx-auto h-100 d-flex flex-column" style={{ maxWidth: '900px' }}>
                
                <div className="d-flex justify-content-between align-items-center mb-3 flex-shrink-0">
                    <h2 className="fw-bolder text-dark m-0">Settings</h2>
                    {statusMessage && (
                        <Alert variant={statusMessage.type} onClose={() => setStatusMessage(null)} dismissible className="m-0 py-2 px-3">
                            {statusMessage.text}
                        </Alert>
                    )}
                </div>

                <Card className="border-0 shadow-sm rounded-4 flex-grow-1 overflow-hidden">
                    {/* p-4 keeps standard padding without taking up excessive screen space */}
                    <Card.Body className="p-4 d-flex flex-column justify-content-between h-100">
                        
                        {/* 1. ACCOUNT OVERVIEW */}
                        <div className="mb-3">
                            <h5 className="fw-bold text-dark mb-2">Account Overview</h5>
                            <div className="bg-light rounded-4 p-3 d-flex align-items-center border">
                                <div 
                                    className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center me-4 position-relative overflow-hidden shadow-sm border border-2 border-white" 
                                    style={{ width: '65px', height: '65px', cursor: 'pointer', flexShrink: 0 }}
                                    onClick={() => fileInputRef.current.click()}
                                >
                                    {currentUser?.avatar ? (
                                        <img src={currentUser.avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <span className="fs-3 fw-bold">{currentUser?.username?.charAt(0).toUpperCase()}</span>
                                    )}
                                    <div className="position-absolute w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center opacity-0 hover-opacity-100 transition-all">
                                        <i className="bi bi-camera-fill text-white fs-5"></i>
                                    </div>
                                </div>
                                <input type="file" accept="image/*" ref={fileInputRef} className="d-none" onChange={handleImageUpload} />

                                <div>
                                    <h5 className="fw-bold mb-1 m-0">{currentUser?.name || currentUser?.username}</h5>
                                    <Badge bg="primary" className="bg-opacity-10 text-primary border-0 rounded-1 px-2 py-1 mt-1" style={{ letterSpacing: '0.5px' }}>
                                        {(currentUser?.role || 'STUDENT ACCOUNT').toUpperCase()}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        {/* 2. PASSWORD & SECURITY */}
                        <div className="mb-3 pb-3 border-bottom">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="fw-bold text-dark mb-1">Password & Security</h6>
                                    <p className="text-muted mb-2">Update account password for security</p>
                                    <Badge bg="light" text="dark" className="border fw-normal px-2 py-1 text-muted">
                                        Last changed: Recently
                                    </Badge>
                                </div>
                                <Button variant="outline-primary" className="rounded-pill px-4 fw-bold" onClick={() => setShowPasswordModal(true)}>
                                    Change
                                </Button>
                            </div>
                        </div>

                        {/* 3. PERSONAL INFORMATION */}
                        <div className="mb-3 pb-3 border-bottom">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div>
                                    <h6 className="fw-bold text-dark mb-1">Personal Information</h6>
                                    <p className="text-muted m-0">Edit personal details</p>
                                </div>
                                {!isEditing ? (
                                    <Button variant="outline-primary" className="rounded-pill px-4 fw-bold" onClick={() => setIsEditing(true)}>
                                        Edit Details
                                    </Button>
                                ) : (
                                    <Button variant="primary" className="rounded-pill px-4 fw-bold" onClick={() => handleSaveChanges(currentUser?.avatar, name, email)} disabled={isLoading}>
                                        {isLoading ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                )}
                            </div>

                            <Row className="gy-2">
                                <Col sm={4} className="text-muted fw-medium d-flex align-items-center">Full Name</Col>
                                <Col sm={8}>
                                    {isEditing ? (
                                        <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} className="bg-light border-0 shadow-none" />
                                    ) : (
                                        <span className="fw-bold text-dark">{currentUser?.name || currentUser?.username || 'Not set'}</span>
                                    )}
                                </Col>
                                
                                <Col sm={4} className="text-muted fw-medium d-flex align-items-center">Email Address</Col>
                                <Col sm={8}>
                                    {isEditing ? (
                                        <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-light border-0 shadow-none" />
                                    ) : (
                                        <span className="fw-bold text-dark">{currentUser?.email || 'Not set'}</span>
                                    )}
                                </Col>
                            </Row>
                        </div>

                        {/* 4. SESSION HISTORY */}
                        <div className="mb-3">
                            <h6 className="fw-bold text-dark mb-1">Session History</h6>
                            <p className="text-muted mb-2">View previous tutoring sessions</p>
                            
                            <div className="bg-primary bg-opacity-10 rounded-3 p-3 d-flex justify-content-between align-items-center border border-primary border-opacity-25">
                                <span className="fw-bold text-primary">{lessons?.length || 0} Lessons</span>
                                <Button variant="primary" className="rounded-pill px-4 fw-bold shadow-sm" onClick={() => navigate('/dashboard/lessons')}>
                                    View History <i className="bi bi-arrow-right ms-1"></i>
                                </Button>
                            </div>
                        </div>

                        {/* 5. ABOUT APP & LOGOUT */}
                        <div className="d-flex justify-content-between align-items-end mt-auto pt-2">
                            <div>
                                <h6 className="fw-bold text-dark mb-1">About App</h6>
                                <p className="text-muted m-0">
                                    Version 1.2.0 <span className="mx-1">|</span> <span className="text-primary">Developed By: Team Gojit</span>
                                </p>
                            </div>
                            <Button variant="danger" className="rounded-pill px-4 fw-bold shadow-sm" onClick={onLogout}>
                                Logout
                            </Button>
                        </div>

                    </Card.Body>
                </Card>
            </div>

            <Modal show={showPasswordModal} onHide={closePasswordModal} centered backdrop="static">
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fw-bold fs-5">Change Password</Modal.Title>
                </Modal.Header>
                <Modal.Body className="pt-2 px-4 pb-4">
                    
                    {passwordError && <Alert variant="danger" className="py-2 small">{passwordError}</Alert>}
                    {passwordSuccess && <Alert variant="success" className="py-2 small"><i className="bi bi-check-circle-fill me-2"></i>{passwordSuccess}</Alert>}

                    <Form onSubmit={submitPasswordChange}>
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold text-muted">CURRENT PASSWORD</Form.Label>
                            <Form.Control 
                                type="password" 
                                required
                                value={passwords.current}
                                onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                                className="bg-light border-0 shadow-none px-3 py-2" 
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold text-muted">NEW PASSWORD</Form.Label>
                            <Form.Control 
                                type="password" 
                                required
                                value={passwords.new}
                                onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                                className="bg-light border-0 shadow-none px-3 py-2" 
                            />
                        </Form.Group>
                        <Form.Group className="mb-4">
                            <Form.Label className="small fw-bold text-muted">CONFIRM NEW PASSWORD</Form.Label>
                            <Form.Control 
                                type="password" 
                                required
                                value={passwords.confirm}
                                onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                                className="bg-light border-0 shadow-none px-3 py-2" 
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="light" className="rounded-pill px-4 fw-bold text-muted" onClick={closePasswordModal} disabled={isChangingPassword}>
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit" className="rounded-pill px-4 fw-bold shadow-sm" disabled={isChangingPassword}>
                                {isChangingPassword ? <><Spinner size="sm" className="me-2"/> Updating...</> : 'Update Password'}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            <style>{`.hover-opacity-100:hover { opacity: 1 !important; }`}</style>
        </Container>
    );
};

export default Settings;