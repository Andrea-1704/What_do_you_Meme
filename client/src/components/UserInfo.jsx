import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Alert } from 'react-bootstrap';
import API from '../API.mjs';
import dayjs from 'dayjs';

function UserInfo() {
  const [userInfo, setUserInfo] = useState(null);
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState('');

  

  const getUserInfo = async () => {
    return await API.getUserInfo();
  };

  const getHistory = async () => {
    return await API.getHistory();
    
  };

  const getRoundById = async (id) => {
    return await API.getRoundById(id);
  };

  const getMemeById = async (id) => {
    return await API.getMemeById(id);
  };

  useEffect(() => {
    //console.log("history", history);
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

          //console.log("rounds", rounds);
          // Get meme details for each round
          const roundsWithMemes = await Promise.all(rounds.map(async (round) => {
            const meme = await getMemeById(round.idMeme);
            const didascaliaScelta = await API.getDidascaliaById(round.idDidScelta);
            const didascaliaC1 = await API.getDidascaliaById(round.idDidC1);
            const didascaliaC2 = await API.getDidascaliaById(round.idDidC2);
            //console.log("didascaliaScelta", didascaliaScelta);
            return { ...round, meme, didascaliaScelta, didascaliaC1, didascaliaC2 };
          }));

          //console.log("roundsWithMemes", roundsWithMemes);

          return { ...game, rounds: roundsWithMemes };
        }));

        setUserInfo(user);
        setHistory(historyWithRounds);
        
        //console.log("user", user);
        console.log("history", historyWithRounds);
      } catch (error) {
        setMessage({msg: error, type: 'danger'});
        
      }
    };

    fetchUserInfo();
  }, []);

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  const renderGameHistory = () => {
    return history.map((game) => (
      <React.Fragment key={game.id}>
        <tr>
          <td colSpan="2" className="game-header">
            Game ID: {game.id} - Date: {dayjs(game.date).format('YYYY-MM-DD')}
          </td>
        </tr>
        {game.rounds.map((round) => (
          <tr key={round.id}>
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
      {message && <Row>
      <Alert variant={message.type} onClose={() => setMessage('')} dismissible>{message.msg}</Alert>
      </Row> }
      <Row>
      
        <Col xs={12}>
          <p>Name: {userInfo.name}</p>
          <p>Email: {userInfo.username}</p>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <h2>Game History</h2>
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
    </Container>
  );
}

export default UserInfo;
