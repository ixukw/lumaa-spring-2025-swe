import { useState } from 'react';
import { AuthContext } from './contexts/authContext';
import { TaskComponent, NavigationComponent } from './components';

import './App.css';

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
