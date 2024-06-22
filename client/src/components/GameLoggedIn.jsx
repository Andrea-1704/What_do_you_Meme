import { useState, useEffect } from 'react';
import API from '../API.mjs';
import { useNavigate } from 'react-router-dom';
import './GameLoggedIn.css';  // Assicurati di creare un file CSS separato

function GameLoggedIn() {
  const [meme1, setMeme1] = useState(null);
  const [meme2, setMeme2] = useState(null);
  const [meme3, setMeme3] = useState(null);
  const [memeAttuale, setMemeAttuale] = useState(null);
  const [punteggio1, setPunteggio1] = useState(-1);
  const [punteggio2, setPunteggio2] = useState(-1);
  const [punteggio3, setPunteggio3] = useState(-1);
  const [round, setRound] = useState(0);
  const [error, setError] = useState(null);
  const [didascalie1, setDidascalie1] = useState([]);
  const [didascalie2, setDidascalie2] = useState([]);
  const [didascalie3, setDidascalie3] = useState([]);
  const [didCorrette1, setDidCorrette1] = useState([]);
  const [didCorrette2, setDidCorrette2] = useState([]);
  const [didCorrette3, setDidCorrette3] = useState([]);
  const [scelta1, setScelta1] = useState(null); 
  const [scelta2, setScelta2] = useState(null); 
  const [scelta3, setScelta3] = useState(null); 
  const [didascalieAttuali, setDidascalieAttuali] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(30); 
  const [riprova, setRiprova] = useState(0);
  const [message, setMessage] = useState('');
  const [idRounds, setIdRound]=useState([]);

  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchMeme = async () => {
      try {
        if (round < 3) {
          const memeData = await API.fetchMeme();
          if (round === 0) {
            setMeme1(memeData);
            setMemeAttuale(memeData);
          }
          if (round === 1) {
            // if (memeData.id === meme1.id) {
            //   setRiprova(riprova + 1);
            //   return;
            // } else {
              setMeme2(memeData);
              setMemeAttuale(memeData);
            //}
          }
          if (round === 2) {
            // if (memeData.id === meme1.id || memeData.id === meme2.id) {
            //   setRiprova(riprova + 1);
            // } else {
              setMeme3(memeData);
              setMemeAttuale(memeData);
            // }
          }
          setRound(round + 1);
        }
      } catch (err) {
        setError(err.message);
      }
    };
    fetchMeme();
  }, [scelta1, scelta2, scelta3, riprova]); 

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeRemaining(timeRemaining => timeRemaining - 1);
    }, 1000);

    const timeoutId = setTimeout(() => {
    }, 30000);

    if (timeRemaining === 1) {
      clearInterval(intervalId);
      //cambio il punteggio:
      if(round===1) {
        setPunteggio1(0);
      }
      if(round===2) setPunteggio2(0);
      if(round===3) setPunteggio3(0);
      if (round < 3) {
        setRound(round + 1);
        setTimeRemaining(30);
      }
      setMessage({ msg: `Tempo scaduto!`, type: 'danger' });
    }

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [timeRemaining]);



  useEffect(() => {
    const fetchDataAndSendGame = async () => {
      try {
        if (meme3 && scelta3) {

          const round1 = await API.sendRound(meme1.id, scelta1, didCorrette1[0], didCorrette1[1]);
          const round2 = await API.sendRound(meme2.id, scelta2, didCorrette2[0], didCorrette2[1]);
          const round3 = await API.sendRound(meme3.id, scelta3, didCorrette3[0], didCorrette3[1]);
          
          // Una volta che tutte le promesse sono risolte, invia i dati del gioco
          await API.sendGame(round1.associazioneId, round2.associazioneId, round3.associazioneId);
          // Puoi aggiungere ulteriori log o azioni qui se necessario
          console.log("Game data sent successfully");
        }
      } catch (err) {
        console.error("Error sending game data", err);
      }
    };
  
    fetchDataAndSendGame();
  }, [scelta3]);
  

  useEffect(() => {
    const fetchDidascalie = async () => {
      if (round === 1) {
        if (meme1) {
          try {
            const uncorrectData = await API.fetchDidascalieScorrette(meme1.id);
            const correctData = await API.fetchDidascalieCorrette(meme1.id);
            setDidCorrette1([correctData[0].id, correctData[1].id]);
            const allDidascalie = [...correctData, ...uncorrectData];
            const shuffledDidascalie = allDidascalie.sort(() => Math.random() - 0.5);
            setDidascalie1(shuffledDidascalie);
            setDidascalieAttuali(shuffledDidascalie);
            setTimeRemaining(30);
          } catch (err) {
            throw new Error('Failed to fetch didascalie');
          }
        }
      }

      if (round === 2) {
        if (meme2) {
          try {
            const uncorrectData = await API.fetchDidascalieScorrette(meme2.id);
            const correctData = await API.fetchDidascalieCorrette(meme2.id);
            await setDidCorrette2([correctData[0].id, correctData[1].id]);
            const allDidascalie = [...correctData, ...uncorrectData];
            const shuffledDidascalie = allDidascalie.sort(() => Math.random() - 0.5);
            setDidascalie2(shuffledDidascalie);
            setDidascalieAttuali(shuffledDidascalie);
            setTimeRemaining(30);
          } catch (err) {
            throw new Error('Failed to fetch didascalie');
          }
        }
      }

      if (round === 3) {
        if (meme3) {
          try {
            const uncorrectData = await API.fetchDidascalieScorrette(meme3.id);
            const correctData = await API.fetchDidascalieCorrette(meme3.id);
            setDidCorrette3([correctData[0].id, correctData[1].id]);
            const allDidascalie = [...correctData, ...uncorrectData];
            const shuffledDidascalie = allDidascalie.sort(() => Math.random() - 0.5);
            setDidascalie3(shuffledDidascalie);
            setDidascalieAttuali(shuffledDidascalie);
            setTimeRemaining(30);
          } catch (err) {
            throw new Error('Failed to fetch didascalie');
          }
        }
      }
    };

    fetchDidascalie();
  }, [meme1, meme2, meme3]);

  const getButtonStyle = (didascaliaId, round) => {
    let scelta, punteggio;

    if (round === 1) {
      scelta = scelta1;
      punteggio = punteggio1;
    } else if (round === 2) {
      scelta = scelta2;
      punteggio = punteggio2;
    } else if (round === 3) {
      scelta = scelta3;
      punteggio = punteggio3;
    }

    if (scelta === didascaliaId) {
      if (punteggio === 0) {
        return { backgroundColor: 'red', color: 'white' };
      } else if (punteggio === 5) {
        return { backgroundColor: 'green', color: 'white' };
      }
    }

    return {};
  };

  const gestisciDidClick = async (didascaliaId) => {
    try {
      if (round === 1 &&meme1) {
        const score = await API.getPunteggio(meme1.id, didascaliaId);
        const isCorrect = parseInt(score);
        setScelta1(didascaliaId);
        //setPunteggio1(isCorrect);
        if (isCorrect === 5) {
          setMessage({ msg: `COMPLIMENTI; E' CORRETTO`, type: 'success' });
          setPunteggio1(5);
        } else {
          setPunteggio1(0);
          setMessage({ msg: `HAI SBAGLIATO; RITENTA!`, type: 'danger' });
        }
      }
      if (round === 2&&meme2) {
        const score = await API.getPunteggio(meme2.id, didascaliaId);
        const isCorrect = parseInt(score);
        setScelta2(didascaliaId);
        if (isCorrect === 5) {
          setPunteggio2(5);
          setMessage({ msg: `COMPLIMENTI; E' CORRETTO`, type: 'success' });
        } else {
          setPunteggio2(0);
          setMessage({ msg: `HAI SBAGLIATO; RITENTA!`, type: 'danger' });
        }
      }
      if (round === 3&&meme3) {
        const score = await API.getPunteggio(meme3.id, didascaliaId);
        const isCorrect = parseInt(score);
        setScelta3(didascaliaId);
        if (isCorrect === 5) {
          setPunteggio3(5);
          setMessage({ msg: `COMPLIMENTI; E' CORRETTO`, type: 'success' });
        } else {
          setPunteggio3(0);
          setMessage({ msg: `HAI SBAGLIATO; RITENTA!`, type: 'danger' });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const renderFinalResults = () => {
    const memes = [meme1, meme2, meme3];
    const didascalie = [didascalie1, didascalie2, didascalie3];
    //const scelte = [scelta1, scelta2, scelta3];
    //const punteggi = [punteggio1, punteggio2, punteggio3];

    //tasto per giocare ancora:
    const handlePlayAgain = () => {
      setRound(0);
      setMeme1(null);
      setMeme2(null);
      setMeme3(null);
      setPunteggio1(-1);
      setPunteggio2(-1);
      setPunteggio3(-1);
      setDidascalie1([]);
      setDidascalie2([]);
      setDidascalie3([]);
      setDidCorrette1([]);
      setDidCorrette2([]);
      setDidCorrette3([]);
      setScelta1(null);
      setScelta2(null);
      setScelta3(null);
      setDidascalieAttuali([]);
      setTimeRemaining(30);
      setRiprova(0);
      setMessage('');
    };

    const handleUserInfo = () => {
      navigate('/game');
    }
  
    return (
      <div className="final-results">
        {memes.map((meme, index) => (
          <div key={index} className="result-item">
            <img className="meme-image" src={meme.path} alt={`meme${index + 1}`} />
            <div className="result-buttons">
              {didascalie[index].map((didascalia) => (
                <button
                  key={didascalia.id}
                  style={getButtonStyle(didascalia.id, index + 1)}
                >
                  {didascalia.testo}
                </button>
              ))}
            </div>
          </div>
        ))}
        <div className="final-buttons">
          <button 
            style={{ backgroundColor: 'blue', color: 'white' }}
            onClick={handlePlayAgain}
            >Play again</button>
          <button 
            style={{ backgroundColor: 'green', color: 'white' }}
            onClick={handleUserInfo}
            >User information</button>
      </div>
      </div>
    );
  };

  if (round >= 3&&scelta3) {
    return (
      <div className="game-container">
        {renderFinalResults()}
        <div>
          <h1>Risultati finali</h1>
          <h2>Meme 1: {punteggio1}</h2>
          <h2>Meme 2: {punteggio2}</h2>
          <h2>Meme 3: {punteggio3}</h2>
          
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="game-container">
        <div>Error: {error}</div>
      </div>
    );
  }

  if (!memeAttuale) {
    return (
      <div className="game-container">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="game-container">
      <div>
        <img className="meme-image" src={memeAttuale.path} alt="current meme" />
      </div>
      <div className="buttons-container">
        {didascalieAttuali.map((didascalia) => (
          <button
            key={didascalia.id}
            className="didascalia-button"
            onClick={() => gestisciDidClick(didascalia.id)}
            style={getButtonStyle(didascalia.id, round)}
          >
            {didascalia.testo}
          </button>
        ))}
      </div>
      <div>
        <h1>Round {round} di 3</h1>
        <h2>Tempo rimasto: {timeRemaining} secondi</h2>
      </div>
      {message && (
        <div className={`message ${message.type}`}>
          {message.msg}
        </div>
      )}
    </div>
  );
}

export default GameLoggedIn;
