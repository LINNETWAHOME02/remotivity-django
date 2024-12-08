// SignUp.jsx
import { useState } from 'react';
import './SignUp.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../contexts/useAuth.jsx";


function SignUp() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Get the register user function from useAuth
  const {register} = useAuth()

  const navigate = useNavigate();


  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send formData object in the request
      const response = register(username, email, password)

      // Save the newUser data to localStorage
      const newUser = response.data;
      if (newUser) {
        localStorage.setItem('dataUser', JSON.stringify(newUser));
      }

      // Navigate to tasks page
      navigate('/tasks');
    } catch (error) {
      console.error('Error signing up:', error.response?.data?.message || error.message);
    }
  };

  // If user already has an account
  const handleNavigate = () => {
    navigate('/log-in')
  }

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Sign Up</button>

        <p onClick={handleNavigate}>Already have an account? Log In...</p>
      </form>
    </div>
  );
}

export default SignUp;
