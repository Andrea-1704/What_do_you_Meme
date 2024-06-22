import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table } from 'react-bootstrap';
import API from '../API.mjs';
import dayjs from 'dayjs';

function UserInfo() {
  const [userInfo, setUserInfo] = useState(null);
  const [history, setHistory] = useState([]); 

  const getUserInfo = async () => {
    return await API.getUserInfo();
  };

  const getHistory = async () => {
    return await API.getHistory();

  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const user = await getUserInfo();
        const history = await getHistory();
        setUserInfo(user);
        setHistory(history);
        console.log("user", user);
        console.log("history", history);
      } catch (error) {
        console.error("Failed to fetch user info:", error);
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
          <td colSpan="4" className="game-header">Game ID: {game.id} - Date: {dayjs(game.date).format('YYYY-MM-DD')}</td>
        </tr>
        {[game.idR1, game.idR2, game.idR3].map((round, index) => (
          <tr key={round.id}>
            <td>
              <img src={`/path/to/memes/${round.idMeme}.jpg`} alt={`Meme ${round.idMeme}`} style={{ width: '100px' }} />
            </td>
            <td>{round.idDidScelta}</td>
            <td>{round.idDidC1}</td>
            <td>{round.idPunteggio}</td>
          </tr>
        ))}
      </React.Fragment>
    ));
  };

  return (
    <Container fluid>
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
                <th>Selected Caption</th>
                <th>Correct Caption</th>
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
