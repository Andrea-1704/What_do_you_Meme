import { Container, Navbar } from 'react-bootstrap';

// UPDATED
function NavHeader() {
    return (
      <Navbar bg='primary' data-bs-theme='dark'>
        <Container fluid>
          <Navbar.Brand>What do you meme?</Navbar.Brand>
        </Container>
      </Navbar>
    );
  }
  

export default NavHeader;
