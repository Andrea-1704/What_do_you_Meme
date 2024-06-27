
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

function Risposta() {
  let { corretto } = useParams(); // Estrae il parametro corretto dall'oggetto useParams

  
  const isCorrect = parseInt(corretto, 10); // Converte il parametro in un numero intero

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
        <h1 style={{ color: isCorrect === 1 ? 'green' : 'red' }}>
            {isCorrect === 1 ? "Risposta corretta, congratulazioni" : "Risposta errata. Ritenta!"}
        </h1>
        <nav style={{ marginTop: '20px' }}>
            <Link to="/" style={{ marginRight: '10px', textDecoration: 'none', color: 'blue' }}>Torna alla Home</Link>
            <Link to="/play" style={{ textDecoration: 'none', color: 'blue' }}>Gioca ancora</Link>
        </nav>
    </div>
  );
}

export default Risposta;
