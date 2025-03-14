import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Alert } from 'react-bootstrap';
import API from '../API.mjs';
import dayjs from 'dayjs';
import './GameLoggedIn.css'

function UserInfo() {
  const [userInfo, setUserInfo] = useState(null);
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState('');

  

  const getUserInfo = async () => {
    try {
      return await API.getUserInfo();
    } catch (error) {
      setMessage({ msg: "Non autorizzato" || 'Errore sconosciuto', type: 'danger' });
  }
  };

  const getHistory = async () => {
    try {
      return await API.getHistory();
    } catch (error) {
      setMessage({ msg: "Non autorizzato" || 'Errore sconosciuto', type: 'danger' });
  }
    
  };

  const getRoundById = async (id) => {
    try {
      return await API.getRoundById(id);
    }
    catch (error) {
      setMessage({ msg: "Non autorizzato" || 'Errore sconosciuto', type: 'danger' });
  }
  };

  const getMemeById = async (id) => {
    try {
      return await API.getMemeById(id);
    } catch (error) {
      setMessage({ msg: "Non autorizzato" || 'Errore sconosciuto', type: 'danger' });
  }
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const user = await getUserInfo();
        const history = await getHistory();

        // Get details for each round in each game
        const historyWithRounds = await Promise.all(history.map(async (game) => {
          const rounds = await Promise.all([
            getRoundById(game.idR1),
            getRoundById(game.idR2),
            getRoundById(game.idR3),
          ]);

          // Get meme details for each round
          const roundsWithMemes = await Promise.all(rounds.map(async (round) => {
            const meme = await getMemeById(round.idMeme);
            const didascaliaScelta = await API.getDidascaliaById(round.idDidScelta);
            // const didascaliaC1 = await API.getDidascaliaById(round.idDidC1);
            // const didascaliaC2 = await API.getDidascaliaById(round.idDidC2);
            return { ...round, meme, didascaliaScelta};
          }));


          return { ...game, rounds: roundsWithMemes };
        }));

        setUserInfo(user);
        setHistory(historyWithRounds);
        
      } catch (error) {
        setMessage({ msg: "Non autorizzato" || 'Errore sconosciuto', type: 'danger' });
   
      }
    };

    fetchUserInfo();
  }, []);

  if (!userInfo ) {
    return (
    <>
        {message ? (
          <Alert variant="danger" onClose={() => setMessage('')} dismissible>{message.msg}</Alert>
        ) : (
          <>
            <div>Loading...</div>
          </>
        )}
    </>
    );
  
  }

  const renderGameHistory = () => {
    return history.map((game) => (
      <React.Fragment key={game.id}>
        <tr className="game-header">
          <td colSpan="2">
            Game ID: {game.id} - Date: {dayjs(game.date).format('YYYY-MM-DD')}
          </td>
        </tr>
        {game.rounds.map((round) => (
          <tr key={round.id} className={`game-row game-row-${round.id%3}`}>
            <td className="compact-cell">
              <img
                src={`${round.meme.path}`}
                alt={`Meme ${round.idMeme}`}
                style={{ width: '100px' }}
              />
            </td>
            <td className="compact-cell">{round.idPunteggio}</td>
          </tr>
        ))}
      </React.Fragment>
    ));
  };

  return (
    <Container fluid>
      <Row>
        {message ? (
          <Row>
            <Alert variant={message.type} onClose={() => setMessage('')} dismissible>{message.msg}</Alert>
          </Row>
        ) : (
          <>
            <Col xs={12}>
            <h2>Informazioni personali</h2>
              <p>Name: {userInfo.name}</p>
              <p>Email: {userInfo.username}</p>
            </Col>
            <Row>
              <Col xs={12}>
                <h2>Cronologia</h2>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Meme</th>
                      <th>Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {renderGameHistory()}
                  </tbody>
                </Table>
              </Col>
            </Row>
          </>
        )}
      </Row>
    </Container>
  );
  
}

export default UserInfo;
