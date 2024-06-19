/* eslint-disable react/prop-types */
// NavHeader.js
import { Container } from 'react-bootstrap';
import '../App.css'; // Assicurati di importare il file CSS
import {Row, Col} from 'react-bootstrap';
import UserInfo from './UserInfo';
import { useNavigate } from 'react-router-dom';



function LoginInfo(props) {
    const navigate = useNavigate();
    return (
      <Container fluid className="d-flex flex-column justify-content-between" style={{ height: '100vh' }}>
        <Row>
          <Col xs={8}>
            <UserInfo />
          </Col>
          <Col xs={4} className="d-flex justify-content-end align-items-center">
            <button className="logout-button" onClick={()=> props.handleLogout(navigate)}>
              Logout
            </button>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col xs={12} className="d-flex justify-content-center">
            <button className="play-button" onClick={()=> props.playTheGame(navigate)}>
              Play
            </button>
          </Col>
        </Row>
      </Container>
    );
  }

export default LoginInfo;
