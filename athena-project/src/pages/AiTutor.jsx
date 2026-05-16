import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, ListGroup, Card, Form, Button, InputGroup, Spinner, Modal, Badge } from 'react-bootstrap';
import { useOutletContext, useNavigate } from 'react-router-dom';

const AiTutor = () => {
    const { 
        currentUser, conversations, deleteConversation, addMessageToChat,
        addConversation, generateStandaloneLesson, generateStandaloneQuiz,
        generateContentFromDocument 
    } = useOutletContext();

    const navigate = useNavigate();
    const [activeChatId, setActiveChatId] = useState(null);
    const [userInput, setUserInput] = useState('');
    const [level, setLevel] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    
    const [showNewModal, setShowNewModal] = useState(false);
    const [newTopic, setNewTopic] = useState('');
    const [newSubject, setNewSubject] = useState('Math');
    
    const [isGeneratingHandout, setIsGeneratingHandout] = useState(false);
    const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
    
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    const activeChat = conversations.find(c => c.id === activeChatId);
    const showGenerateButtons = (activeChat?.messages?.length || 0) >= 4;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [activeChat?.messages, isLoading]);

    // Upgraded to accept direct messages from the file uploader
    const handleSendMessage = async (e, directMessage = null) => {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        
        const currentInput = directMessage || userInput;
        if (!currentInput.trim() || !activeChatId) return;

        const userMessage = { role: 'user', content: currentInput };
        addMessageToChat(activeChatId, userMessage);
        
        if (!directMessage) setUserInput(''); 
        setIsLoading(true);

        try {
            const isLocalId = activeChatId > 1000000000;
            const backendId = isLocalId ? null : activeChatId;

            const response = await fetch('http://localhost:8000/api/ask-athena/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    question: currentInput, 
                    level: level, 
                    conversation_id: backendId, 
                    user_id: currentUser.id,
                    title: activeChat?.title,
                    subject: activeChat?.subject
                })
            });

            const data = await response.json();
            
            if (data.response) {
                if (isLocalId && data.conversation_id) {
                    const realChat = {
                        ...activeChat,
                        id: data.conversation_id,
                        messages: [...activeChat.messages, userMessage, { role: 'ai', content: data.response }]
                    };
                    deleteConversation(activeChatId);
                    addConversation(realChat);
                    setActiveChatId(data.conversation_id);
                } else {
                    addMessageToChat(activeChatId, { role: 'ai', content: data.response });
                }
            }
        } catch (error) {
            console.error("API Error:", error);
            addMessageToChat(activeChatId, { role: 'ai', content: "Server connection failed." });
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirmNewChat = (e) => {
        if (e) e.preventDefault();
        if (!newTopic.trim()) return;

        const newId = Date.now(); 
        const newChat = {
            id: newId,
            title: newTopic,
            subject: newSubject,
            time: "Just now",
            messages: [{ role: 'ai', content: `Hello! I'm Athena. Let's master **${newTopic}** together. Ask me anything!` }] 
        };

        addConversation(newChat);
        setActiveChatId(newId);
        setShowNewModal(false);
        setNewTopic('');
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file && activeChatId) {
            // Send a message so Django saves the conversation permanently
            const fileMessage = `📎 **Attached Document:** ${file.name}\n\nPlease analyze this document and extract the key concepts.`;
            handleSendMessage(null, fileMessage);
            
            // Trigger backend lesson/quiz generation
            generateContentFromDocument(file, 5);
        }
    };

    return (
        <>
            <style>{`
                .chat-scrollbar::-webkit-scrollbar { width: 6px; }
                .chat-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .chat-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(0,0,0,0.1); border-radius: 10px; }
                .hover-scale { transition: transform 0.2s; }
                .hover-scale:hover { transform: scale(1.05); }
            `}</style>

            <Container fluid className="p-0 overflow-hidden" style={{ height: 'calc(100vh - 110px)' }}>
                <Row className="g-4 h-100 m-0">
                    
                    <Col md={8} className="d-flex flex-column h-100 p-0 pe-md-2">
                        {activeChatId ? (
                            <Card className="border-0 shadow-sm rounded-4 flex-grow-1 d-flex flex-column overflow-hidden">
                                
                                <Card.Header className="bg-white border-bottom py-3 px-4 d-flex justify-content-between align-items-center flex-wrap gap-3 z-1 flex-shrink-0">
                                    <div className="d-flex align-items-center">
                                        <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex justify-content-center align-items-center me-3 shadow-sm border border-primary border-opacity-25" style={{width: '45px', height: '45px'}}>
                                            <i className="bi bi-robot fs-4"></i>
                                        </div>
                                        <div>
                                            <h5 className="fw-bold m-0 text-dark" style={{maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{activeChat?.title}</h5>
                                            <Badge bg="light" text="secondary" className="border fw-semibold mt-1 px-2 py-1">{activeChat?.subject || 'General'}</Badge>
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-center gap-3 ms-auto">
                                        {showGenerateButtons && (
                                            <div className="d-flex gap-2">
                                                <Button size="sm" variant="success" className="rounded-pill fw-bold shadow-sm px-3 hover-scale" onClick={async () => { setIsGeneratingHandout(true); await generateStandaloneLesson(activeChat.title); setIsGeneratingHandout(false); navigate('/dashboard/lessons'); }} disabled={isGeneratingHandout}>
                                                    {isGeneratingHandout ? <Spinner size="sm" /> : <i className="bi bi-file-earmark-text me-1"></i>} Handout
                                                </Button>
                                                <Button size="sm" variant="warning" className="rounded-pill fw-bold shadow-sm text-dark px-3 hover-scale" onClick={async () => { setIsGeneratingQuiz(true); await generateStandaloneQuiz(activeChat.title, 5); setIsGeneratingQuiz(false); navigate('/dashboard/quizzes'); }} disabled={isGeneratingQuiz}>
                                                    {isGeneratingQuiz ? <Spinner size="sm" /> : <i className="bi bi-ui-checks me-1"></i>} Quiz
                                                </Button>
                                            </div>
                                        )}
                                        <div className="bg-light rounded-pill p-1 border shadow-sm d-flex align-items-center">
                                            {[1, 2, 3].map(l => (
                                                <Button key={l} variant={level === l ? "primary" : "transparent"} size="sm" className={`rounded-pill px-3 fw-bold border-0 ${level === l ? 'shadow-sm text-white' : 'text-muted'}`} onClick={() => setLevel(l)}>L{l}</Button>
                                            ))}
                                            <span className="mx-2 text-primary fw-bold" style={{minWidth: '45px', fontSize: '0.8rem'}}>
                                                {level === 1 ? 'Hint' : level === 2 ? 'Logic' : 'Solve'}
                                            </span>
                                        </div>
                                    </div>
                                </Card.Header>

                                <Card.Body className="px-4 py-4 chat-scrollbar flex-grow-1" style={{ overflowY: 'auto', backgroundColor: '#fcfcfc' }}>
                                    {activeChat?.messages.map((msg, idx) => (
                                        <div key={idx} className={`d-flex mb-4 ${msg.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                                            {msg.role === 'ai' && (
                                                <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center me-3 mt-auto mb-1 shadow-sm" style={{width: '30px', height: '30px', minWidth: '30px'}}>
                                                    <i className="bi bi-robot" style={{fontSize: '0.9rem'}}></i>
                                                </div>
                                            )}
                                            <div 
                                                className={`p-3 shadow-sm ${msg.role === 'user' ? 'bg-primary text-white ms-5' : 'bg-white text-dark me-5 border border-light-subtle'}`} 
                                                style={{ 
                                                    maxWidth: '80%', 
                                                    borderRadius: '1.5rem',
                                                    borderBottomRightRadius: msg.role === 'user' ? '4px' : '1.5rem',
                                                    borderBottomLeftRadius: msg.role === 'ai' ? '4px' : '1.5rem',
                                                    lineHeight: '1.6'
                                                }}
                                            >
                                                <div dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                                            </div>
                                        </div>
                                    ))}
                                    
                                    {isLoading && (
                                        <div className="d-flex justify-content-start mb-4">
                                            <div className="bg-white p-3 shadow-sm border border-light-subtle" style={{ borderRadius: '1.5rem', borderBottomLeftRadius: '4px' }}>
                                                <Spinner animation="grow" size="sm" variant="primary" className="me-1"/>
                                                <Spinner animation="grow" size="sm" variant="primary" className="me-1" style={{animationDelay: '0.2s'}}/>
                                                <Spinner animation="grow" size="sm" variant="primary" style={{animationDelay: '0.4s'}}/>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </Card.Body>

                                <Card.Footer className="bg-white border-top-0 p-3 pt-0 flex-shrink-0">
                                    <Form onSubmit={(e) => handleSendMessage(e)}>
                                        <InputGroup className="bg-light rounded-pill p-1 shadow-sm border border-light-subtle">
                                            <Button variant="light" className="rounded-circle border-0 text-secondary bg-transparent ms-1 hover-scale" onClick={() => fileInputRef.current.click()}>
                                                <i className="bi bi-paperclip fs-5"></i>
                                            </Button>
                                            <input type="file" ref={fileInputRef} hidden onChange={handleFileUpload} />
                                            
                                            <Form.Control 
                                                className="border-0 bg-transparent px-3 py-2 shadow-none fw-medium text-dark" 
                                                placeholder="Ask Athena anything..." 
                                                value={userInput} 
                                                onChange={(e) => setUserInput(e.target.value)} 
                                            />
                                            
                                            <Button variant="primary" className="rounded-circle border-0 m-1 shadow-sm hover-scale d-flex align-items-center justify-content-center" type="submit" disabled={!userInput.trim() || isLoading} style={{width: '40px', height: '40px'}}>
                                                <i className="bi bi-send-fill"></i>
                                            </Button>
                                        </InputGroup>
                                    </Form>
                                </Card.Footer>
                            </Card>
                        ) : (
                            <Card className="border-0 shadow-sm rounded-4 flex-grow-1 d-flex justify-content-center align-items-center text-center p-5">
                                <div className="bg-primary bg-opacity-10 rounded-circle d-flex justify-content-center align-items-center mb-4" style={{width: '100px', height: '100px'}}>
                                    <i className="bi bi-chat-left-dots-fill text-primary" style={{fontSize: '3rem'}}></i>
                                </div>
                                <h3 className="fw-bold text-dark mb-2">Welcome to Athena Tutor</h3>
                                <p className="text-muted" style={{maxWidth: '300px'}}>Select a discussion from the sidebar or start a new topic to begin your personalized learning session.</p>
                                <Button variant="primary" className="rounded-pill px-4 py-2 mt-3 fw-bold shadow-sm" onClick={() => setShowNewModal(true)}>
                                    <i className="bi bi-plus-lg me-2"></i>Start Learning
                                </Button>
                            </Card>
                        )}
                    </Col>

                    <Col md={4} className="d-flex flex-column h-100 p-0 ps-md-2">
                        <div className="d-flex justify-content-between align-items-center mb-3 px-1 flex-shrink-0">
                            <h5 className="fw-bold m-0 text-dark">Discussions</h5>
                            <Button variant="primary" size="sm" className="rounded-pill px-3 fw-bold shadow-sm hover-scale" onClick={() => setShowNewModal(true)}>
                                <i className="bi bi-plus-lg me-1"></i> New
                            </Button>
                        </div>
                        
                        <Card className="border-0 shadow-sm rounded-4 flex-grow-1 d-flex flex-column overflow-hidden" style={{ backgroundColor: '#f4f5f7' }}>
                            <ListGroup variant="flush" className="overflow-auto chat-scrollbar p-2 flex-grow-1">
                                {conversations.map(chat => (
                                    <div 
                                        key={chat.id}
                                        className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center border-0 px-3 py-3 mb-2 rounded-3 transition-all ${activeChatId === chat.id ? 'bg-white shadow-sm border-start border-primary border-4' : 'bg-transparent text-dark hover-bg-light'}`}
                                        onClick={() => setActiveChatId(chat.id)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className="text-truncate pe-2">
                                            <strong className={activeChatId === chat.id ? 'text-primary' : 'text-dark'}>{chat.title}</strong><br/>
                                            <small className={activeChatId === chat.id ? 'text-muted' : 'opacity-75'}>{chat.subject} • {chat.time || 'Saved'}</small>
                                        </div>
                                        <Button variant="link" size="sm" className={`p-0 ${activeChatId === chat.id ? 'text-danger' : 'text-muted opacity-50'}`} onClick={(e) => { e.stopPropagation(); deleteConversation(chat.id); if (activeChatId === chat.id) setActiveChatId(null); }}>
                                            <i className="bi bi-trash"></i>
                                        </Button>
                                    </div>
                                ))}
                            </ListGroup>
                        </Card>
                    </Col>
                </Row>

                <Modal show={showNewModal} onHide={() => setShowNewModal(false)} centered backdrop="static">
                    <Modal.Header closeButton className="border-0 pb-0">
                        <Modal.Title className="fw-bold">Start a New Topic</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="pt-2">
                        <Form onSubmit={handleConfirmNewChat}>
                            <Form.Group className="mb-4">
                                <Form.Label className="small fw-bold text-muted" style={{letterSpacing: '0.5px'}}>WHAT ARE WE LEARNING?</Form.Label>
                                <Form.Control type="text" placeholder="e.g. Cellular Respiration, Calculus" value={newTopic} onChange={(e) => setNewTopic(e.target.value)} autoFocus className="rounded-3 px-3 py-2 bg-light border-0 shadow-none" style={{fontSize: '1.1rem'}}/>
                            </Form.Group>
                            <Form.Group className="mb-4">
                                <Form.Label className="small fw-bold text-muted" style={{letterSpacing: '0.5px'}}>SELECT SUBJECT</Form.Label>
                                <Form.Select value={newSubject} onChange={(e) => setNewSubject(e.target.value)} className="rounded-3 px-3 py-2 bg-light border-0 shadow-none fw-medium text-dark">
                                    <option value="Math">Math</option>
                                    <option value="Science">Science</option>
                                    <option value="English">English</option>
                                    <option value="History">History</option>
                                    <option value="Computer Science">Computer Science</option>
                                    <option value="General">General / Other</option>
                                </Form.Select>
                            </Form.Group>
                            <Button variant="primary" type="submit" className="w-100 rounded-pill py-2 fw-bold shadow-sm" disabled={!newTopic.trim()}>
                                Let's Go <i className="bi bi-arrow-right ms-1"></i>
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </Container>
        </>
    );
};

export default AiTutor;