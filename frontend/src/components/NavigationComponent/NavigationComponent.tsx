import { useState } from 'react';

import AuthComponent from '../AuthComponent/AuthComponent';
import { useAuthContext } from '../../contexts/authContext';

import './NavigationComponent.css'

export default function NavigationComponent() {
  const [toggleLogin, setToggleLogin] = useState(false);
  const authContext = useAuthContext();

  return (
    <div className="navigation-component">
      {authContext.user ? 
      <div>
        <button onClick={() => {
          setToggleLogin(false);
          authContext.setUser('');
        }}>Logout</button>
      </div>
      :
      <div>
        <button className="login-toggle" onClick={() => setToggleLogin(true)}>Login/Register</button>
      </div>}

      
      {toggleLogin && !authContext.user && 
      <div className="auth-component-container">
        <button className="login-dismiss-button" onClick={() => {
          setToggleLogin(false);
        }}>Close Login Window</button>
        <AuthComponent />
      </div>}
    </div>
  )
}