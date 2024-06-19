/* eslint-disable react/prop-types */
// NavHeader.js
import { Container, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../App.css'; // Assicurati di importare il file CSS
function NavHeader() {
  return(
    <Navbar bg='primary' data-bs-theme='dark' expand="lg" className='nav-header'>
      <Container fluid>
        <Link to='/' className='navbar-brand'>What do you meme?</Link>
        {/* NEW */}
      </Container>
    </Navbar>
  );
}

export default NavHeader;
