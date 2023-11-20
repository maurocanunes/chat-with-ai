import React from 'react';
import './App.css';
import Conversation from './Components/Chat/Conversation';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  return (
    <div className="App">
      <header className="App-header">
        <Conversation />
      </header>
    </div>
  );
}

export default App;
