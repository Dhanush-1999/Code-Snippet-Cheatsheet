import { useState } from 'react';

export default function AuthPage({ setAuth }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin
      ? 'http://localhost:5000/api/users/login'
      : 'http://localhost:5000/api/users/register';

    const payload = isLogin ? { email, password } : { name, email, password };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Something went wrong');
      }

      if (data.token) {
        // If login is successful, pass the token and name to App.jsx
        setAuth(data.token, data.name);
      } else {
        // If registration is successful, alert the user and switch to login view
        alert('Registration successful! Please log in.');
        setIsLogin(true);
        setName('');
        setEmail('');
        setPassword('');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
      </form>
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Need to register?' : 'Have an account? Login'}
      </button>
    </div>
  );
}