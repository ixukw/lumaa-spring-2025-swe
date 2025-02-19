import { useState } from 'react';
import './App.css';

import { AuthContext } from './contexts/authContext';

import { TaskComponent, NavigationComponent } from './components';

function App() {
  const [user, setUser] = useState<string>('');
  return (
    <div className="App">
      <AuthContext.Provider value={{ user, setUser }}>
        <NavigationComponent />
        <TaskComponent />
      </AuthContext.Provider>
    </div>
  );
}

export default App;
