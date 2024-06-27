/* eslint-disable react/prop-types */
import 'bootstrap/dist/css/bootstrap.min.css';
import {  useState } from 'react';
import { Container,  Button } from 'react-bootstrap';
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { BrowserRouter as Router, Link, useLocation } from 'react-router-dom';
import NavHeader from './components/NavHeader';
import API from './API.mjs';
import { LoginForm } from './components/AuthComponents';
import LogInfo from './components/LogInfo';
import RandomMeme from './components/RandomMeme';
import Risposta from './components/Risposta';
import GameLoggedIn from './components/GameLoggedIn';

function HomeButtons() {
  const location = useLocation();

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

function LoggedButton(props) {
  const location = useLocation();

  if (location.pathname === '/') {
    return (
      <div>
        <Link to="/loggedGame">
          <button>Play game</button>
        </Link>
        <span style={{ margin: '0 10px' }}>or</span>
        <Link to="/user">
          <button>My data</button>
        </Link>
        <span style={{ margin: '0 10px' }}>or</span>
        <Button onClick={props.handleLogout}>Logout</Button>
      </div>
    );
  }

  return null; // Don't render anything if the path is not '/'
}

function App() {
  
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState('');
  
 
  const handleLogin = async (credentials, navigate) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const user = await API.logIn(credentials);
      setLoggedIn(true);
      setMessage({msg: `Welcome, ${user.name}!`, type: 'success'});
      /*
      SE TUTTO E' ANDATO A BUON FINE SETTO LO STATO DELL'UTENTE
      E LO STATO DEL MESSAGGIO CHE MI DICE CHE IL LOGIN E' ANDATO
      E QUESTO MESSAGGIO E' SEMPLICEMENTE UNO STATO CHEPOI NELLA RETURN
      MI PERMETTE DI RENDERIZZARE UN COMPONENTE CHE VISUALIZZA 
      UAN BELLA GRAFICA CHE GESTISCE QUELLO CHE VOGLIO FARE.
      */
      setUser(user);
      navigate('/user');
    }catch(err) {
      throw err;
      /*
      NOTA BENE: QUESTO TI PERMETTE DI AVERE LA 
      SCHERAMATA ROSSA PER DIRE CHE IL LOGIN NON 
      E' ANDATO A BUON FINE.

      NOTA CHE QUESTO MESSAGGIO E' SEMPLICEMENTE UNO STATO 
      CHE POI NEL RETURN GESTISCO PER ANDARE A MOSTRARE 
      IL GIUSTO MESSAGGIO DI ERRORE O DI CONFERMA.
      */
    }
  };


  const handleLogout = async (navigate) => {
    await API.logOut();
    setLoggedIn(false);
    // clean up everything
    setMessage('Logged out successfully!');
    navigate('/');
  };

  
  const playTheGame = async (navigate) => {
    
    navigate('/loggedGame');
  };
 




  
  return (
   <Router>
    <Routes>
      <Route element={<>
        <NavHeader />
        <Container fluid className='mt-3'>
          {/*questo mi mostra l'eventuale messaggio di errore
          o di successo\*/}
          
          <Outlet/>
        </Container>
        </>
      }>
        <Route index element={
          loggedIn ? (
            <LoggedButton handleLogout={handleLogout} /> 
          ) : (
            <HomeButtons />
          )
        } />
        <Route path="/login" element={
              //nb:
              //se l'utente è loggato lo mando alla home altrimenti gli faccio vedere il form di login
              /*
              chiaramente se SIAMO LOGGATI NON VEDREMO IL PULSANTE PER
              LOGGARCI, PERO' SE IO VADO ALLA PAGINA DEL LOGIN ANDANDO A 
              INCOLLARE IL PATH DELLA PAGINA SU CHROME VOGLIAMO GESTIRE CHE 
              SE SONO LOGGATO MI MANDI ALLA HOME
              */
              
              loggedIn ? <Navigate replace to='/' /> : <LoginForm login={handleLogin} />
            } />
          <Route path="/play" element={<RandomMeme />} /> 
          <Route path="/risposta/:corretto" element={<Risposta />} /> 
          <Route path="/user" element={<LogInfo  loggedIn={loggedIn} handleLogout={handleLogout} playTheGame={playTheGame} />} />
          <Route path="/loggedGame" element={<GameLoggedIn />} />
          
      </Route>
    </Routes>
    </Router> 
  );
  

}

export default App;
