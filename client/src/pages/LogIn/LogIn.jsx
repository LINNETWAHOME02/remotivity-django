// Login.jsx
import { useState } from 'react';
import './LogIn.css';
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../contexts/useAuth.jsx";

function LogIn() {
  // Grab the inputs and store them in values using useState
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Use log in authentication in contexts/useAuth.jsx
  const {login_user} = useAuth()

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = login_user(username, password)

      const newUser = response.data;
      if (newUser) {
        localStorage.setItem('dataUser', JSON.stringify(newUser));
      }

      // Navigate to tasks page
      navigate('/tasks')

      console.log('Logged in successfully');
    } catch (error) {
      console.error('Error logging in:', error.response?.data?.message || error.message);
    }
  };

  // If user doesn't have an account redirect them to the signup page
  const handleNavigate = () => {
    navigate('/sign-up')
  }

  return (
    <div className="login-container">
      <h2>Log In</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={handleUsernameChange}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={handlePasswordChange}
          required
        />

        <button type="submit">Log In</button>
        <p onClick={handleNavigate}>Don&#39;t have an account? Sign Up...</p>
      </form>
    </div>
  );
}

export default LogIn;
