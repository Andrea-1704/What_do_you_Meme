import React from 'react';
import { useLocation } from 'react-router-dom';
import './ShowResultsPage.css'; // Assicurati di creare e collegare questo file CSS

const ShowResultsPage = () => {
  const location = useLocation();
  const { state } = location;

  const memes = [
    { meme: state.meme1, didascalie: state.didascalie1, punteggio: state.punteggio1, scelta: state.scelta1 },
    { meme: state.meme2, didascalie: state.didascalie2, punteggio: state.punteggio2, scelta: state.scelta2 },
    { meme: state.meme3, didascalie: state.didascalie3, punteggio: state.punteggio3, scelta: state.scelta3 },
  ];

  return (
    <div className="results-container">
      <table className="results-table">
        <thead>
          <tr>
            <th>Meme</th>
            <th>Didascalie</th>
          </tr>
        </thead>
        <tbody>
          {memes.map((item, index) => (
            <tr key={index}>
              <td>
                <img src={item.meme.path} alt={`Meme ${index + 1}`} className="meme-image" />
              </td>
              <td>
                <ul className="didascalie-list">
                  {item.didascalie.map((didascalia, idx) => (
                    <li 
                      key={idx} 
                      className={`didascalia-item ${item.scelta === idx ? (item.punteggio === 0 ? 'selected-red' : 'selected-green') : ''}`}
                    >
                      {didascalia}
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShowResultsPage;
