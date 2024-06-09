// import
import express, {json} from 'express';
import morgan from 'morgan';
import { getAMeme, getDidascaliaById, createMeme, getCorrectDid, getUncorrectDid, addDidascalia, addAssociazione } from './Dao.mjs';

// init
const app = express();
const port = 3001;

// middleware
app.use(json());
app.use(morgan('dev'));

/* ROUTE */

// GET /api/meme
app.get('/api/meme', (request, response) => {
  getAMeme()
  .then(meme => response.json(meme))
  .catch(() => response.status(500).end());
})

//metodo per ottenere due tra le descrizioni 
//corrette per il meme
// GET /api/meme
app.get('/api/meme/:id/correct', (request, response) => {
  getCorrectDid(request.params.id)
  .then(did => response.json(did))
  .catch(() => response.status(500).end());
})

//metodo per ottenere cinque descrizioni scorrette per
//un meme:

app.get('/api/meme/:id/uncorrect', (request, response) => {
  getUncorrectDid(request.params.id)
  .then(did => response.json(did))
  .catch(() => response.status(500).end());
})

//metodo per ricevere la didascalia dall'id
app.get('/api/didascalia/:id', (request, response) => {
  getDidascaliaById(request.params.id)
  .then(didascalia => response.json(didascalia))
  .catch(() => response.status(500).end());
})








//metodi per riesmpire il database:
// POST /api/meme
app.post('/api/meme', (request, response) => {
  const meme = request.body;
  createMeme(meme)
  .then(questions => response.json(questions))
  .catch(() => response.status(500).end());
})
app.post('/api/didascalie', (request, response) => {
  console.log(request.body)
  const didascalia = request.body;
  addDidascalia(didascalia.didascalia)
  .then(questions => response.json(questions))
  .catch(() => response.status(500).end());
})
//metodo post per aggiungere associazione tra meme e didascalia
app.post('/api/associazione', (request, response) => {
  const { idMeme, idDid } = request.body;
  addAssociazione(idMeme, idDid)
    .then(associazioneId => response.json({ associazioneId }))
    .catch((err) => {
      console.error("Errore nell'aggiungere l'associazione:", err.message);
      response.status(500).end();
    });
});




// far partire il server
app.listen(port, () => { console.log('API server started'); });