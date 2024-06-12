// NavHeader.js
import { Container, Navbar } from 'react-bootstrap';
import '../App.css'; // Assicurati di importare il file CSS

function NavHeader() {
  return (
    <div className="nav-header">
      <Navbar variant="dark">
        <Container fluid>
          <Navbar.Brand>What do you meme?</Navbar.Brand>
        </Container>
      </Navbar>
    </div>
  );
}

export default NavHeader;
