import { useState, useEffect } from 'react';
import API from '../API.mjs';
import { Alert, Row } from 'react-bootstrap';
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
  const [didascalieAttualiCor, setDidascalieAttualiCor] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(30); 
  const [riprova, setRiprova] = useState(0);
  const [message, setMessage] = useState('');
  const [lostTurn, setLostTurn] = useState(false);
  const [sceltaErrata, setSceltaErrata] = useState(false);
  const [finito, setFinito] = useState(false);

  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchMeme = async () => {
      try {
        //se la scelta è errata non mostro il nuovo meme perché devo ancora attendere che 
        //l'utente mi clicci next per farmi capire che posso andare avanti:
        //NOTA CHE QUINDI E' DENTRO L'AZIONE DI NET CHE DEVO RENDERE SCELTA ERRATA FALSE
        if(sceltaErrata===false){
          let riprovato=0;
          if (round < 3) {
            const memeData = await API.fetchMeme();
            setMessage('');
            if (round === 0) {
              setMeme1(memeData);
              setMemeAttuale(memeData);
            }
            if (round === 1) {
              if (memeData.id === meme1.id) {
                setRiprova(riprova + 1);
                riprovato=1;
              } else {
                setMeme2(memeData);
                setMemeAttuale(memeData);
              }
            }
            if (round === 2) {
              if (memeData.id === meme1.id || memeData.id === meme2.id) {
                setRiprova(riprova + 1);
                riprovato=1;
              } else {
                setMeme3(memeData);
                setMemeAttuale(memeData);
              }
            }
            if(riprovato===0){setRound(round + 1);}
          }
        }
      } catch (err) {
        
        setMessage({ msg: err.message, type: 'danger' });
      }
    };
    fetchMeme();
  }, [scelta1, scelta2, scelta3, riprova, sceltaErrata]); 

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeRemaining(timeRemaining => timeRemaining - 1);
    }, 1000);

    const timeoutId = setTimeout(() => {
    }, 30000);
    //nota che se la scelta è errata ancora devo attendere che l'utente clicci il 
    //tasto next quindi è necessario "congelare" il tempo:
    if (timeRemaining <= 1 && sceltaErrata===false && !finito) {
      clearInterval(intervalId);
      //cambio il punteggio:
      let tempoScaduto=0;//variabile che mi serve solo per decidere 
      //quale messaggio mostrare all'utente: tempo scaduto oppure
      //risposta errata
      if(round===1) {
        setPunteggio1(0);
        //setLostTurn(true);
        if(!scelta1){
          setScelta1(-1);
          tempoScaduto=1;
        }
        //se la scelta è meno uno per un dato round si assuma che sia 
        //terminato il timer.
      }
      if(round===2){ 
        setPunteggio2(0); 
        if(!scelta2){
          setScelta2(-1);
          tempoScaduto  =1;
        }
        //setLostTurn(true);
      }
      if(round===3){ 
        setPunteggio3(0); 
        if(!scelta3){
          setScelta3(-1);
          tempoScaduto=1;
        }
        //setLostTurn(true);
      }
      if (round < 3) {
        //setRound(round + 1);
        setTimeRemaining(30);
      }
      if(tempoScaduto===1){
        setMessage({ msg: `Tempo scaduto!`, type: 'danger' });
      }else{
        setMessage({ msg: `Risposta errata`, type: 'danger' });
      }
    }

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [timeRemaining]);



  useEffect(() => {
    const fetchDataAndSendGame = async () => {
      try {
        // Se tutte le scelte sono state fatte, invia i dati del gioco
        //attenzione che l'ultimo round potrebbe essere "terminato per il 
        //timer", quindi si effettua il check che la scelta 3 non sia proprio 
        //meno uno.
        if (meme3 && (scelta3||scelta3===-1)) {
          //memorizzo nel back and anche, tra tutte le didascalie corrette
          //per un meme quali erano esattamente le due mostrate. 
          //Questa cosa è evitabile!
          setFinito(true);
          const round1 = await API.sendRound(meme1.id, scelta1, didCorrette1[0], didCorrette1[1]);
          const round2 = await API.sendRound(meme2.id, scelta2, didCorrette2[0], didCorrette2[1]);
          const round3 = await API.sendRound(meme3.id, scelta3, didCorrette3[0], didCorrette3[1]);
          
          // Una volta che tutte le promesse sono risolte, invia i dati del gioco
          await API.sendGame(round1.associazioneId, round2.associazioneId, round3.associazioneId);
        }
      } catch (err) {
        setMessage({ msg: err.message, type: 'danger' });
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
            setDidascalieAttualiCor([correctData[0].id, correctData[1].id]);
            const allDidascalie = [...correctData, ...uncorrectData];
            const shuffledDidascalie = allDidascalie.sort(() => Math.random() - 0.5);
            setDidascalie1(shuffledDidascalie);
            setDidascalieAttuali(shuffledDidascalie);
            setTimeRemaining(30);
          } catch (err) {
            setMessage({ msg: err.message, type: 'danger' });
          }
        }
      }

      if (round === 2) {
        if (meme2) {
          try {
            const uncorrectData = await API.fetchDidascalieScorrette(meme2.id);
            const correctData = await API.fetchDidascalieCorrette(meme2.id);
            setDidCorrette2([correctData[0].id, correctData[1].id]);
            setDidascalieAttualiCor([correctData[0].id, correctData[1].id]);
            const allDidascalie = [...correctData, ...uncorrectData];
            const shuffledDidascalie = allDidascalie.sort(() => Math.random() - 0.5);
            setDidascalie2(shuffledDidascalie);
            setDidascalieAttuali(shuffledDidascalie);
            setTimeRemaining(30);
          } catch (err) {
            setMessage({ msg: err.message, type: 'danger' });
          }
        }
      }

      if (round === 3) {
        if (meme3) {
          try {
            const uncorrectData = await API.fetchDidascalieScorrette(meme3.id);
            const correctData = await API.fetchDidascalieCorrette(meme3.id);
            setDidCorrette3([correctData[0].id, correctData[1].id]);
            setDidascalieAttualiCor([correctData[0].id, correctData[1].id]);
            const allDidascalie = [...correctData, ...uncorrectData];
            const shuffledDidascalie = allDidascalie.sort(() => Math.random() - 0.5);
            setDidascalie3(shuffledDidascalie);
            setDidascalieAttuali(shuffledDidascalie);
            setTimeRemaining(30);
          } catch (err) {
            setMessage({ msg: err.message, type: 'danger' });
          }
        }
      }
    };

    fetchDidascalie();
  }, [meme1, meme2, meme3]);

  const getButtonStyle = (didascaliaId, roundPassato) => {
    let scelta;
    //andiamo a prendere la scelta del round:
    if (roundPassato === 1) {
      scelta = scelta1;
    } else if (roundPassato === 2) {
      scelta = scelta2;
    } else if (roundPassato === 3) {
      scelta = scelta3;
    }

    if (scelta === didascaliaId) {
        return { backgroundColor: 'green', color: 'white' };
    }
    return {};
  };


  const gestisciDidClick = async (didascaliaId) => {
    try {
      setLostTurn(false);
      if (round === 1 && meme1 && scelta1===null) {
        
        const score = await API.getPunteggio(meme1.id, didascaliaId);
        const isCorrect = parseInt(score);
        setScelta1(didascaliaId);
        if (isCorrect === 5) {
          setPunteggio1(5);
          setMessage({ msg: `COMPLIMENTI; E' CORRETTO`, type: 'success' });
        } else {
          setSceltaErrata(true);
          setPunteggio1(0);
          setTimeRemaining(1);
          setMessage({ msg: `HAI SBAGLIATO; RITENTA!`, type: 'danger' });
        }
      }
      if (round === 2 && meme2 && scelta2===null) {
        const score = await API.getPunteggio(meme2.id, didascaliaId);
        const isCorrect = parseInt(score);
        setScelta2(didascaliaId);
        if (isCorrect === 5) {
          setPunteggio2(5);
          setMessage({ msg: `COMPLIMENTI; E' CORRETTO`, type: 'success' });
        } else {
          setSceltaErrata(true);
          setPunteggio2(0);
          setTimeRemaining(1);
          setMessage({ msg: `HAI SBAGLIATO; RITENTA!`, type: 'danger' });
        }
      }
      if (round === 3&&meme3&&scelta3===null) {
        const score = await API.getPunteggio(meme3.id, didascaliaId);
        const isCorrect = parseInt(score);
        setScelta3(didascaliaId);
        if (isCorrect === 5) {
          setPunteggio3(5);
          setMessage({ msg: `COMPLIMENTI; E' CORRETTO`, type: 'success' });
        } else {
          setSceltaErrata(true);
          setPunteggio3(0);
          setTimeRemaining(1);
          setMessage({ msg: `HAI SBAGLIATO; RITENTA!`, type: 'danger' });
        }
      }
    } catch (err) {
      setMessage({ msg: err.message, type: 'danger' });
    }
  };
  //metodo che serve per prendere la lista di tutti i meme correttamente 
  //associati (per il rendering finale):
  const correctMemes=() =>{
    let result=[];
    if(punteggio1===5){
      result.push(meme1);
    }
    if(punteggio2===5){
      result.push(meme2);
    }
    if(punteggio3===5){
      result.push(meme3);
    }
    return result;
  }

  const correctDidascalie=()=> {
    let result=[];
    if(punteggio1===5){
      result.push(didascalie1);
    }
    if(punteggio2===5){
      result.push(didascalie2);
    }
    if(punteggio3===5){
      result.push(didascalie3);
    }
    return result;
  }

  //funzione che mi serve per renderizzare i risultati finali:
  const renderFinalResults = () => {
  
    const memes = correctMemes();
    const didascalie = correctDidascalie();
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
      setSceltaErrata(false);
      setFinito(false);
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


  const handleSceltaErrataClick = () => {
    //const sceltaEffettuata= sceltaErrata;
    setSceltaErrata(false);
    // if(round===1){
    //   setScelta1(sceltaEffettuata);
    // }
    // if(round===2){
    //   setScelta2(sceltaEffettuata);
    // }
    // if(round===3){
    //   setScelta3(sceltaEffettuata);
    // }
    setTimeRemaining(30);
  }

  //metodo per dire se la didascalia è corretta:
  const didCorretta = (didascaliaId) => {
    for(let i=0; i<didascalieAttualiCor.length; i++){
      if(didascalieAttualiCor[i]===didascaliaId){
        return true;
      }
    }
    return false;
  }

  //metodo per scegliere la classe css del button:
  const getClasseButton = (didascaliaId) => {
    if (sceltaErrata!=false && didCorretta(didascaliaId)) {
      return 'didascalia-button-correct';
    }
    return 'didascalia-button';
  };


  // if(message){
  //   return (
  //     <>
  //     {message && <Row>
  //       <Alert variant={message.type} onClose={() => setMessage('')} dismissible>{message.msg}</Alert>
  //     </Row> }
  //     </>
  //   )
  // }

  //rendering finale:
  if (round >= 3&&scelta3&&sceltaErrata===false) {
    return (
      <div className="game-container">
        {message && <div>
          <Alert variant={message.type} onClose={() => setMessage('')} dismissible>{message.msg}</Alert>
        </div> }
        <div>
          <h1>Risultati finali</h1>
          <h2>Meme 1: {punteggio1}</h2>
          <h2>Meme 2: {punteggio2}</h2>
          <h2>Meme 3: {punteggio3}</h2>
          
        </div>
        {renderFinalResults()}
      </div>
    );
  }

  
  //pagina di caricamento:
  if (!memeAttuale) {
    return (
      <div className="game-container">
        <div>Loading...</div>
      </div>
    );
  }

  

  return (
    <div className="game-container">
       {message && 
            <Alert variant={message.type} onClose={() => setMessage('')} dismissible>{message.msg}</Alert>
       }
    
    <div>
      
    
    <img className="meme-image" src={memeAttuale.path} alt="current meme" />
  </div>
  <div className="buttons-container">
    {didascalieAttuali.map((didascalia) => (
      <button
        key={didascalia.id}
        className={getClasseButton(didascalia.id)}
        onClick={() => gestisciDidClick(didascalia.id)}
      >
        {didascalia.testo}
      </button>
    ))}
  </div>
  <div>
    <h1>Round {round} di 3</h1>
    {!(sceltaErrata||sceltaErrata===-1) && (
    <h2>Tempo rimasto: {timeRemaining} secondi</h2>
  )}
    {/* Condizione per mostrare il pulsante se sceltaErrata è true */}
    {(sceltaErrata||sceltaErrata===-1) && (
      <button onClick={handleSceltaErrataClick}>Next</button>
    )}
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
