// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import API from '../API.mjs';
import { useNavigate } from 'react-router-dom';

function RandomMeme() {
  const [meme, setMeme] = useState(null);
  const [error, setError] = useState(null);
  const [didascalie, setDidascalie] = useState([]);
  const navigate=useNavigate();
  
  useEffect(() => {
    const fetchMeme = async () => {
      try {
        const memeData = await API.fetchMeme();
        setMeme(memeData);
      } catch (err) {
        setError(err.message);
      }
    };
    // Chiamata alla funzione fetchMeme
    fetchMeme();
  }, []); // Array di dipendenze vuoto per eseguire l'effetto solo al montaggio del componente


  useEffect(() => {
    const fetchDidascalie = async () => {
      if (meme) {
        try {
          const uncorrectData = await API.fetchDidascalieScorrette(meme.id);
          const correctData = await API.fetchDidascalieCorrette(meme.id);
          const allDidascalie = [...correctData, ...uncorrectData];
          const shuffledDidascalie = allDidascalie.sort(() => Math.random() - 0.5);
          //console.log(shuffledDidascalie);
          setDidascalie(shuffledDidascalie);
        } catch (err) {
          throw new Error('Failed to fetch didascalie');
        }
      }
    };

    fetchDidascalie();
  }, [meme]); // Esegue questo effetto solo quando `meme` cambia*/


  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!meme) {
    return <div>Loading...</div>;
  }
  
  const gestisciDidClick = async (didascaliaId) => {
    
    try {
      const score = await API.getPunteggio(meme.id, didascaliaId);
      let corretto=0;
      const isCorrect = parseInt(score);
      if (isCorrect === 5) {
        corretto=1;
        navigate(`/risposta/${corretto}`);
      } else {
        // Se la didascalia non è corretta
        navigate(`/risposta/${corretto}`);
      }
    } catch (err) {
      console.error(err);
      // Handle error here
    }
  };


  return (
    <div style={{ textAlign: 'center' }}>
      <img src={meme.path} alt={meme.id} style={{ width: '300px', height: '200px' }} />
      <div style={{ marginTop: '20px' }}>
        {didascalie.slice(0, 7).map((didascalia, index) => (
          <button 
            key={index} 
            style={{ display: 'block', marginBottom: '10px', padding: '10px', fontSize: '16px' }}
            onClick={() => gestisciDidClick(didascalia.id)}
          >
            {didascalia.testo}
          </button>
        ))}
      </div>
    </div>
  );
}

export default RandomMeme;
