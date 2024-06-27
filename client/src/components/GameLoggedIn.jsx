import { useState, useEffect } from 'react';
import API from '../API.mjs';
import { Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './GameLoggedIn.css';  // Assicurati di creare un file CSS separato


function GameLoggedIn() {

  const [meme, setMeme] = useState([null, null, null]);
  const [punteggi, setPunteggi] = useState([-1, -1, -1]);
  const [round, setRound] = useState(0);
  const [didascalie, setDidascalie] = useState([]);
  const [didCorrette, setDidCorrette] = useState([]);
  const [scelte, setScelte] = useState([null, null, null]);
  const [sceltaTemporanea, setSceltaTemporanea] = useState(null);//variabile che mi serve per memorizzare la scelta temporanea
  const [timeRemaining, setTimeRemaining] = useState(30); 
  const [riprova, setRiprova] = useState(0);
  const [message, setMessage] = useState('');
  const [messageErrore, setMessageErrore] = useState('');//variabile che mi serve per memorizzare il messaggio di errore
  const [finito, setFinito] = useState(false);
  const [roundFinito, setRoundFinito]= useState(false);
  //il round finito è true solo quando mostro i risultati di fine round

  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchMeme = async () => {
      try {
        //se la scelta è errata non mostro il nuovo meme perché devo ancora attendere che 
        //l'utente mi clicci next per farmi capire che posso andare avanti:
        //NOTA CHE QUINDI E' DENTRO L'AZIONE DI NET CHE DEVO RENDERE SCELTA ERRATA FALSE
        if(roundFinito===false || finito===false){
          let riprovato=0;
          if (round < 3) {
            const memeData = await API.fetchMeme();
            setMessage('');
            //verifico che memeData sia differente da tutti i meme in meme:
            for(let i=0;i<meme.length;i++){
              if(meme[i]!=null &&meme[i].id===memeData.id){
                riprovato=1;
                setRiprova(riprova+1);
              }
            }
            if(!riprovato){
              const newMeme = [...meme];
              newMeme[round] = memeData;
              setMeme(newMeme);
              setRound(round + 1);
            }
          }
        }
      } catch (err) {
        setMessageErrore({ msg: "Errore nella ricezione del meme", type: 'danger' });
      }
    };
    fetchMeme();
  }, [scelte, riprova]); 

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeRemaining(timeRemaining => timeRemaining - 1);
    }, 1000);

    const timeoutId = setTimeout(() => {
    }, 30000);
    if (timeRemaining <= 1 && roundFinito===false && !finito) {
      clearInterval(intervalId);
      //cambio il punteggio:
      let tempoScaduto=0;//variabile che mi serve solo per decidere 
      //quale messaggio mostrare all'utente: tempo scaduto oppure
      //risposta errata

      let newPunteggi = [...punteggi];
      newPunteggi[round-1]=0;
      setPunteggi(newPunteggi);
      if(roundFinito===false)setRoundFinito(true);//quando scade il tempo devo mostrare i risultati.
      if(!scelte[round-1]){
        setSceltaTemporanea(-1);
        tempoScaduto=1;
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
    const fetchDidascalie = async () => {
      try{
        if(round>0&&meme[round-1]!=null){
          const uncorrectData = await API.fetchDidascalieScorrette(meme[round-1].id);
          const correctData = await API.fetchDidascalieCorrette(meme[round-1].id);
          let newDidCor=[...didCorrette];
          newDidCor[round-1]=[correctData[0].id, correctData[1].id];
          setDidCorrette(newDidCor);
          const allDidascalie = [...correctData, ...uncorrectData];
          const shuffledDidascalie = allDidascalie.sort(() => Math.random() - 0.5);
          let newDid=[...didascalie];
          newDid[round-1]=shuffledDidascalie;
          setDidascalie(newDid);
          setTimeRemaining(30);
          setRoundFinito(false);
        }
      } catch (err) {
        setMessageErrore({ msg: "errore nella ricezione delle didascalie", type: 'danger' });
      }
    };

    fetchDidascalie();
  }, [meme]);

  const gestisciDidClick = async (didascaliaId) => {

    try{
      if(scelte[round-1]===null){
        const score = await API.getPunteggio(meme[round-1].id, didascaliaId);
        const isCorrect = parseInt(score);
        setRoundFinito(true);//ora devo mostrare i risultati del round
        // let newScelte=[...scelte];
        // newScelte[round-1]=didascaliaId;
        // setScelte(newScelte);
        setSceltaTemporanea(didascaliaId);
       
        if (isCorrect === 5) {
          let newPunteggi=[...punteggi];
          newPunteggi[round-1]=5;
          setPunteggi(newPunteggi);
          setMessage({ msg: `COMPLIMENTI; E' CORRETTO: hai guadagnato 5`, type: 'success' });
        } else {
          let newPunteggi=[...punteggi];
          newPunteggi[round-1]=0;
          setPunteggi(newPunteggi);
          setTimeRemaining(1);
          setMessage({ msg: `HAI SBAGLIATO; RITENTA!`, type: 'danger' });
        }
      }
    }catch (err) {
      setMessageErrore({ msg: "Errore del server", type: 'danger' });
    }

   
  };


  useEffect(() => {
    const fetchDataAndSendGame = async () => {
      try {
        if (meme[2] && (scelte[2]||scelte[2]===-1) && !roundFinito) {
          //memorizzo nel back and anche, tra tutte le didascalie corrette
          //per un meme quali erano esattamente le due mostrate. 
          //Questa cosa è evitabile!
          setFinito(true);//il gioco è finito
          const round1 = await API.sendRound(meme[0].id, scelte[0]);
          const round2 = await API.sendRound(meme[1].id, scelte[1]);
          const round3 = await API.sendRound(meme[2].id, scelte[2]);
          
          // Una volta che tutte le promesse sono risolte, invia i dati del gioco
          await API.sendGame(round1.associazioneId, round2.associazioneId, round3.associazioneId);
        }
      } catch (err) {
        setMessageErrore({ msg: "errore nell'invio dei dati", type: 'danger' });
      }
    };
  
    fetchDataAndSendGame();
  }, [scelte, roundFinito]);


  const correctMemes = () => {
    return meme.filter((meme, index) => punteggi[index] === 5);
  };

  const correctDidascalie = () => {
    return didascalie.filter((didascalia, index) => punteggi[index] === 5);
  };

  //prendo la lista dei round per cui ho ottenuto 5 come punteggio:
  const correctRounds = () => {
    let result=[];
    for(let i=0; i<punteggi.length; i++){
      if(punteggi[i]===5){
        result.push(i);
      }
    }
    return result;
  };


  const getButtonStyle = (didascaliaId, roundPassato) => {
    let scelta=scelte[roundPassato];
    if (scelta === didascaliaId) {
        return { backgroundColor: 'green', color: 'white' };
    }
    else{
      return { backgroundColor: 'white', color: 'black' };
    }
  };


  
  
  
  //funzione che mi serve per renderizzare i risultati finali:
  const renderFinalResults = () => {
  
    const memes = correctMemes();
    const didascalie = correctDidascalie();
    const round = correctRounds();
    //const scelte = [scelta1, scelta2, scelta3];
    //const punteggi = [punteggio1, punteggio2, punteggio3];

    //tasto per giocare ancora:
    const handlePlayAgain = () => {
      setRound(0);
      setTimeRemaining(30);
      setRiprova(0);
      setMessage('');
      setFinito(false);
      setMeme([null, null, null]);
      setPunteggi([-1,-1,-1]);
      setDidascalie([]);
      setDidCorrette([]);
      setScelte([null, null, null]);
      setRoundFinito(false);
      setMessageErrore('');
      
    };

    const handleUserInfo = () => {
      navigate('/user');
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
                    style={getButtonStyle(didascalia.id, round[index])}
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


  const handleNextButton = () => {
    setRoundFinito(false);//non mostro più i risultati del round
    //cambio le scelte:
    let newScelte=[...scelte];
    newScelte[round-1]=sceltaTemporanea;
    setScelte(newScelte);
    setTimeRemaining(30);
  }

  //metodo per dire se la didascalia è corretta:
  const didCorretta = (didascaliaId) => {
    for(let i=0; i<didCorrette[round-1].length; i++){
      if(didCorrette[round-1][i]===didascaliaId){
        return true;
      }
    }
    return false;
  }

  //metodo per scegliere la classe css del button:
  const getClasseButton = (didascaliaId) => {
    if (roundFinito && punteggi[round-1]<5 && didCorretta(didascaliaId)) {
      return 'didascalia-button-correct';
    }
    return 'didascalia-button';
  };

  //rendering finale, dopo i tre round:
  if (round > 2&&scelte[2]&&roundFinito===false) {
    return (
      <div className="game-container">

        {messageErrore ? (
          <Alert variant="danger" onClose={() => setMessageErrore('')} dismissible>{messageErrore.msg}</Alert>
        ) : (
          <>
            {message && <div>
          <Alert variant={message.type} onClose={() => setMessage('')} dismissible>{message.msg}</Alert>
        </div> }
        <div>
          <h1>Risultati finali</h1>
          <h2>Meme 1: {punteggi[0]}</h2>
          <h2>Meme 2: {punteggi[1]}</h2>
          <h2>Meme 3: {punteggi[2]}</h2>
          
        </div>
        {renderFinalResults()}
          </>
        )}


        
      </div>
    );
  }

  
  //pagina di caricamento:
  if (round === 0 || !meme[round - 1]) {
    return (
      <div className="game-container">
        {messageErrore ? (
          <Alert variant="danger" onClose={() => setMessageErrore('')} dismissible>{messageErrore.msg}</Alert>
        ) : (
          <>
            <div>Loading...</div>
          </>
        )}
      </div>
    );
  }

  

  return (
    <div className="game-container">
      {messageErrore ? (
        <Alert variant="danger" onClose={() => setMessageErrore('')} dismissible>{messageErrore.msg}</Alert>
      ) : (
        <>
          {message && (
            <Alert variant={message.type} onClose={() => setMessage('')} dismissible>{message.msg}</Alert>
          )}
      
          <div>
            <h1>Round {round} di 3</h1>
            {!roundFinito && (
              <h2>Tempo rimasto: {timeRemaining} secondi</h2>
            )}
      
            <img className="meme-image" src={meme[round-1].path} alt="current meme" />
          </div>
          <div className="buttons-container">
            {didascalie[round-1] && didascalie[round-1].map((didascalia) => (
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
            {roundFinito && (
              <button onClick={handleNextButton}>Next</button>
            )}
          </div>
        </>
      )}
    </div>
  );
  
}

export default GameLoggedIn;
