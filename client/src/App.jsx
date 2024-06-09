import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavHeader from './components/NavHeader';
import API from './API.mjs';
import { LoginForm } from './components/AuthComponents';
import { useState } from 'react';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState('');

  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setLoggedIn(true);
      setMessage({msg: `Welcome, ${user.name}!`, type: 'success'});
      setUser(user);
    } catch (err) {
      setMessage({msg: err.message, type: 'danger'});
    }
  };

  return (
    <Router>
      <NavHeader />
      <Routes>
        <Route path="/login" element={<LoginForm login={handleLogin} />} />
      </Routes>
      {message && <div className={`alert alert-${message.type}`}>{message.msg}</div>}
    </Router>
  );
}

export default App;
