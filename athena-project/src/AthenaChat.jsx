import { useState } from 'react';

export default function AthenaChat() {
   
    const [question, setQuestion] = useState('');
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);


    const askAthena = async () => {
        if (!question) return; // Don't send empty questions
        setIsLoading(true);
        setResponse('');

        try {
            // This is the Waiter handing the ticket to the Kitchen!
            const res = await fetch('https://master-athena-final-project.onrender.com/api/ask-athena/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
               
                body: JSON.stringify({
                    question: question,
                    
                })
            });

          
            const data = await res.json();
            setResponse(data.response);
            
        } catch (error) {
            console.error("Error asking Athena:", error);
            setResponse("Oops! The backend server might not be running.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: '600px' }}>
            <h2>Ask Athena 🦉</h2>
            <div className="mb-3">
                <textarea
                    className="form-control"
                    rows="3"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask a question about math, science, or coding..."
                />
            </div>
            
            <button 
                className="btn btn-primary" 
                onClick={askAthena} 
                disabled={isLoading}
            >
                {isLoading ? 'Athena is thinking...' : 'Get Hint'}
            </button>

            {response && (
                <div className="alert alert-info mt-4" style={{ whiteSpace: 'pre-wrap' }}>
                    <strong>Athena says:</strong>
                    <br />
                    {response}
                </div>
            )}
        </div>
    );
}