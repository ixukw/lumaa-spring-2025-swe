import { useAuthContext } from '../../contexts/authContext';
import './AuthComponent.css';

import { useState } from 'react';

export default function LoginComponent() {
  const [status, setStatus] = useState('');
  const [regStatus, setRegStatus] = useState('');
  
  const authContext = useAuthContext();

  const reqHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }

  /**
   * Handles the user login event
   * @param e React event
   */
  async function handleLoginSubmit(e: React.SyntheticEvent): Promise<void> {
    e.preventDefault();

    const form = e.target as typeof e.target & {
      username: { value: string};
      password: { value: string};
    };

    try {
      const username = form.username.value;
      const password = form.password.value;

      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: reqHeaders,
        body: JSON.stringify({
          username: username,
          password: password
        })
      });

      if (!response.ok) {
        setStatus('Invalid username or password, please try again.');
        return;
      }

      const token = await response.json();
      authContext.setUser(token);
      setStatus('');
    } catch (error) {
      setStatus('Internal login error, please try again.');
    }
  }

  /**
   * Handles the user register event
   * @param e React event
   */
  async function handleRegisterSubmit(e: React.SyntheticEvent): Promise<void> {
    e.preventDefault();

    const form = e.target as typeof e.target & {
      username: { value: string};
      password: { value: string};
    };

    const username = form.username.value;
    const password = form.password.value;

    const response = await fetch('http://localhost:3001/auth/register', {
      method: 'POST',
      headers: reqHeaders,
      body: JSON.stringify({
        username: username,
        password: password
      })
    });

    if (!response.ok) {
      setRegStatus('Unable to create account, please try again.');
      return;
    }
    setRegStatus('Success, please login.');
  }

  return (
    <div className="auth-component">

      <div className="login-container">
        <h1>Login</h1>
        <form method="post" onSubmit={handleLoginSubmit}>
          <input name="username" type="text" placeholder="username" required></input><br/>
          <input name="password" type="text" placeholder="password" required></input>
          <button type="submit">Login</button>
        </form>
        {status && <p>{status}</p>}
      </div>

      <div className="register-container">
        <h1>Register</h1>
        <p>Usernames must be unique</p>
        <form method="post" onSubmit={handleRegisterSubmit}>
          <input name="username" type="text" placeholder="username" required></input><br/>
          <input name="password" type="text" placeholder="password" required></input>
          <button type="submit">Register</button>
        </form>
        {regStatus && <p>{regStatus}</p>}
      </div>
    </div>
  )
}