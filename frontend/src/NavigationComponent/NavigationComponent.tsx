import './NavigationComponent.css'

import React, { useState } from 'react';

import AuthComponent from '../AuthComponent/AuthComponent';

export default function NavigationComponent() {
  const [showLogin, setShowLogin] = useState(false);
  return (
    <div className="navigation-component">
      <button className="login-toggle" onClick={() => setShowLogin(true)}>Login/Register</button>
      {showLogin && <AuthComponent />}
    </div>
  )
}