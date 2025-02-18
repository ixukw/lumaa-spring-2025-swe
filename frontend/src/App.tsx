import React, { useState } from 'react';
import './App.css';

import TaskComponent from './TaskComponent/TaskComponent';
import NavigationComponent from './NavigationComponent/NavigationComponent';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  return (
    <div className="App">
      <NavigationComponent />
      {loggedIn && <TaskComponent />}
      {!loggedIn && <p>Please login first to view this resource.</p>}
    </div>
  );
}

export default App;
