import './App.css';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import NavHeader from './components/NavHeader';
import API from './API.mjs';
import { LoginForm } from './components/AuthComponents';
import { useState } from 'react';
import RandomMeme from './components/RandomMeme';
import Risposta from './components/Risposta';

function HomeButtons() {
  const location = useLocation();

  // these are the buttons that will be displayed on the home page
  // these will be shown only if the path is '/'
  if (location.pathname === '/') {
    return (
      <div>
        <Link to="/login">
          <button>Go to Login</button>
        </Link>
        <span style={{ margin: '0 10px' }}>or</span>
        <Link to="/play">
          <button>Play a round</button>
        </Link>
      </div>
    );
  }

  return null; // Don't render anything if the path is not '/'
}

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState('');

  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setLoggedIn(true);
      setMessage({ msg: `Welcome, ${user.name}!`, type: 'success' });
      setUser(user);
    } catch (err) {
      setMessage({ msg: err.message, type: 'danger' });
    }
  };

  return (
    <Router>
      <NavHeader />
      <div style={{ paddingTop: '70px' }}> {/* Evitiamo sovrapposizioni */}
        <Routes>
          <Route path="/login" element={<LoginForm login={handleLogin} />} />
          <Route path="/play" element={<RandomMeme />} /> {/* Add the route for RandomMeme */}
          <Route path="/risposta/:corretto" element={<Risposta />} /> {/* Add the route for Risposta */}
        </Routes>
        {message && <div className={`alert alert-${message.type}`}>{message.msg}</div>}
        <HomeButtons />
      </div>
    </Router>
  );
}

export default App;
