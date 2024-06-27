import { useState, useEffect } from 'react';
import API from '../API.mjs';
import './GameLoggedIn.css';  // Assicurati di creare un file CSS separato

function RandomMeme() {
  const [meme, setMeme] = useState(null);
  const [didascalie, setDidascalie] = useState([]);
  const [didCorrette, setDidCorrette] = useState([]);
  const [scelta, setScelta] = useState(null); //se scelta la pongo pari ad uno significa che ho perso il turno.
  const [punteggio, setPunteggio] = useState(-1);
  const [timeRemaining, setTimeRemaining] = useState(30); 
  const [message, setMessage] = useState('');
  const [sceltaErrata, setSceltaErrata] = useState(false);
  const [ricaricato, setRicaricato] = useState(false);
  
  useEffect(() => {
    const fetchMeme = async () => {
      try {
          const memeData = await API.fetchMeme();
          setMessage('');
          setMeme(memeData);
      } catch (err) {
        setMessage({ msg: err.message, type: 'danger' });
      }
    };
    fetchMeme();
  }, [ricaricato]); 

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeRemaining(timeRemaining => timeRemaining - 1);
    }, 1000);

    const timeoutId = setTimeout(() => {
    }, 30000);

    if (timeRemaining <= 1) {
      clearInterval(intervalId);
      //setPunteggio(0);
      
      setScelta(-1);
      if(!sceltaErrata){
        setSceltaErrata(-1);
      }
      if(punteggio!=0){
        setPunteggio(0);
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
        if (meme) {
          try {
            const uncorrectData = await API.fetchDidascalieScorrette(meme.id);
            const correctData = await API.fetchDidascalieCorrette(meme.id);
            setDidCorrette([correctData[0].id, correctData[1].id]);
            const allDidascalie = [...correctData, ...uncorrectData];
            const shuffledDidascalie = allDidascalie.sort(() => Math.random() - 0.5);
            setDidascalie(shuffledDidascalie);
            setTimeRemaining(30);
          } catch (err) {
            setMessage({ msg: err.message, type: 'danger' });
          }
        }
    };
    //adesso chiamiamo la funzione:
    fetchDidascalie();
  }, [meme]);

  // const getButtonStyle = (didascaliaId) => {
  //   let scelta, punteggio;

  //   if (scelta === didascaliaId) {
  //     if (punteggio === 0) {
  //       return { backgroundColor: 'red', color: 'white' };
  //     } else if (punteggio === 5) {
  //       return { backgroundColor: 'green', color: 'white' };
  //     }
  //   }

  //   return {};
  // };


  

  const gestisciDidClick = async (didascaliaId) => {
    try {
      if (meme&&!scelta) {
        const score = await API.getPunteggio(meme.id, didascaliaId);
        const isCorrect = parseInt(score);
        
        if (isCorrect === 5) {
          setPunteggio(5);
          setScelta(didascaliaId);
          setMessage({ msg: `COMPLIMENTI; E' CORRETTO`, type: 'success' });
        } else {
          setPunteggio(0);
          setScelta(didascaliaId);
          setTimeRemaining(1);
          setSceltaErrata(didascaliaId);
          setMessage({ msg: `HAI SBAGLIATO; RITENTA!`, type: 'danger' });
        }
      }
    } catch (err) {
      setMessage({ msg: err.message, type: 'danger' });
    }
  };

  //metodo per dire se la didascalia è corretta:
  const didCorretta = (didascaliaId) => {
      try{
        for(let i=0; i<didCorrette.length; i++){
          if(didCorrette[i]===didascaliaId){
            return true;
          }
        }
        return false;
      }
      catch(err){
        setMessage({ msg: err.message, type: 'danger' });
      }
  }

  //metodo per scegliere la classe css del button:
  const getClasseButton = (didascaliaId) => {
    if (sceltaErrata!=false &&didCorretta(didascaliaId)) {
      return 'didascalia-button-wrong';
    }
    return 'didascalia-button';
  };


    

    //tasto per giocare ancora:
    const handlePlayAgain = () => {
      setMeme(null);// posso evitare di cambiare il meme perchè il useEffect lo fa già.
      setPunteggio(-1);
      setDidascalie([]);
      setDidCorrette([]);
      setScelta(null);
      setSceltaErrata(false);
      setTimeRemaining(30);
      setMessage('');
      //trovo nuova immagine:
      setRicaricato(!ricaricato);//mi serve solo per far si che il useEffect venga chiamato.
    };

  //return html:
  // if(scelta!=null&&punteggio===5){//se ho cliccato la didascalia corretta:
  //   return (
  //     <div className="final-results">
  //       {memes.map((meme, index) => (
  //         <div key={index} className="result-item">
  //           <img className="meme-image" src={meme.path} alt={`meme${index + 1}`} />
  //           <div className="result-buttons">
  //             {didascalie.map((didascalia) => (
  //               <button
  //                 key={didascalia.id}
  //                 style={getButtonStyle(didascalia.id, index + 1)}
  //               >
  //                 {didascalia.testo}
  //               </button>
  //             ))}
  //           </div>
  //         </div>
  //       ))}
  //       <div className="final-buttons">
  //         <button 
  //           style={{ backgroundColor: 'blue', color: 'white' }}
  //           onClick={handlePlayAgain}
  //           >Play again</button>
  //     </div>
  //     </div>
  //   );
  // }else{
    return (
      <div className="game-container">
        {(meme) ? (
          <>
            <div>
              <img className="meme-image" src={meme.path} alt="current meme" />
            </div>
            <div className="buttons-container">
              {didascalie.map((didascalia) => (
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
              {(!scelta) && (
                <h2>Tempo rimasto: {timeRemaining} secondi</h2>
              )}

              {(scelta||scelta===-1) && (
                <button 
                  style={{ backgroundColor: 'blue', color: 'white' }}
                  onClick={handlePlayAgain}
                >Play again</button>
              )}
              
              {/* Condizione per mostrare il pulsante se sceltaErrata è true */}
              {/* {(sceltaErrata || sceltaErrata === -1) && (
                <button onClick={handleSceltaErrataClick}>Next</button>
              )} */}
            </div>
            {message && (
              <div className={`message ${message.type}`}>
                {message.msg}
              </div>
            )}
          </>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    );
  }

  


export default RandomMeme;
