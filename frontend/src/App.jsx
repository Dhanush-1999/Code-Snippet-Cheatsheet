import { useState, useEffect } from 'react';
import SnippetList from './components/SnippetList';
import SnippetForm from './components/SnippetForm';
import AuthPage from './components/AuthPage';
import ExplanationModal from './components/ExplanationModal';
import './App.css';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userName, setUserName] = useState(localStorage.getItem('userName'));
  const [snippets, setSnippets] = useState([]);
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSetAuth = (newToken, name) => {
    setToken(newToken);
    setUserName(name);
    if (newToken && name) {
      localStorage.setItem('token', newToken);
      localStorage.setItem('userName', name);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
    }
  };

  const fetchSnippets = async () => {
    try {
      const storedToken = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/snippets`, {
        headers: { 'x-auth-token': storedToken },
      });
      if (!response.ok) throw new Error('Failed to fetch snippets');
      const data = await response.json();
      setSnippets(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchSnippets();
    } else {
      setSnippets([]);
    }
  }, [token]);

  const handleAddSnippet = async (newSnippetData) => {
    try {
      const storedToken = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/snippets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': storedToken,
        },
        body: JSON.stringify(newSnippetData),
      });
      if (!response.ok) throw new Error('Failed to create snippet');
      const createdSnippet = await response.json();
      setSnippets([createdSnippet, ...snippets]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteSnippet = async (idToDelete) => {
    try {
      const storedToken = localStorage.getItem('token');
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/snippets/${idToDelete}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': storedToken },
      });
      setSnippets(snippets.filter((snippet) => snippet._id !== idToDelete));
    } catch (error) {
      console.error(error);
    }
  };

  const handleExplainSnippet = async (code) => {
    setIsLoading(true);
    setExplanation('');
    try {
      const storedToken = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ai/explain`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': storedToken,
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Failed to get streaming response');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        setExplanation((prev) => prev + chunk);
      }
    } catch (error) {
      console.error('Error getting explanation:', error);
      alert('Sorry, there was an error getting the explanation.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return <AuthPage setAuth={handleSetAuth} />;
  }

  return (
    <div>
      <header className="app-header">
        <div className="logo-container">
          <img src="/Preview.png" alt="App Logo" className="logo-image" />
          <h1>Code Cheatsheet</h1>
        </div>
        <div className="user-info">
          <span>Welcome, {userName}</span>
          <button onClick={() => handleSetAuth(null, null)}>Logout</button>
        </div>
      </header>
      <hr />
      <SnippetForm onAddSnippet={handleAddSnippet} />
      <hr />
      <SnippetList
        snippets={snippets}
        onDelete={handleDeleteSnippet}
        onExplain={handleExplainSnippet}
      />
      {isLoading && (
        <div className="modal-backdrop">
          <p className="loading-indicator">🤖 The AI is thinking...</p>
        </div>
      )}
      <ExplanationModal
        explanation={explanation}
        onClose={() => setExplanation('')}
      />
    </div>
  );
}
