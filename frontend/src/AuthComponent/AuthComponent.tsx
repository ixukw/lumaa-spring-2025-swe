import './AuthComponent.css';

export default function LoginComponent() {

  return (
    <div className="login-component">
      <div className="login-container">
        <h1>Login</h1>
        <input type="text" placeholder="username"></input><br/>
        <input type="text" placeholder="password"></input>
        <button>Login</button>
      </div>

      <div className="register-container">
        <h1>Register</h1>
        <input type="text" placeholder="username"></input><br/>
        <input type="text" placeholder="password"></input>
        <button>Register</button>
      </div>
    </div>
  )
}