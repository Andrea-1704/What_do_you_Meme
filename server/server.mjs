import express, { json } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import crypto from 'crypto';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';
import { getUser } from './user-dao.mjs';
import { 
  getAMeme, createUser, getDidascaliaById, createMeme, 
  getCorrectDid, getPunteggio, getUncorrectDid, 
  addDidascalia, addAssociazione , getHistory
} from './Dao.mjs';

// init
const app = express();
const port = 3001;

// middleware
app.use(express.json());
app.use(morgan('dev'));
// set up and enable CORS -- UPDATED
const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
  credentials: true
  /*
  credential true ci serve per andare a consentire al server di 
  inviare cookie di sessione al client, ovvero per dire al server
  che può accettare i cookie di un client che non è sullo 
  stesso dominio del server. In questo modo permetti lo scambio
  cookie tra domini diversi (cross-origin)
  */
};
app.use(cors(corsOptions));

// Passport: set up local strategy -- NEW
passport.use(new LocalStrategy(async function verify(username, password, cb) {
  console.log("verify:", username, password);
  const user = await getUser(username, password);
  //NOTAMOLTO BENE: QUESTO E' IL METODO CHE VIENE CHIAMATO QUANDO 
  //VERIFICHIAMO IL LOGIN
  //PER FARLO ABBIAMO CREATO UN FILE APPOSITO PER GEATIRE LA RICERCA
  //DEGLI UTENTI, QUESTO FILE CI SERVE PER MANTENERE TUTTE LE INFORMAZIONI
  //E I METODI PER PRENDERE GLI UTENTI.
  if(!user)
    return cb(null, false, 'Incorrect username or password.');
  //non do indizi all'utente su quale delle due credenziali è sbagliata
    
  return cb(null, user);
}));
//questo è il setup della local strategy. La local strategy è una strategia di autenticazione
//che permette di autenticare un utente tramite username e password.
//verify(username, password, cb) è il metodo per verificare le credenziali dell'utente.


//QUESTI METODI DI SERIALIZE E DESERIALIZE USER SONO METODI DI PASSPOR
passport.serializeUser(function (user, cb) {
  //LA FUNZIOEN NOTA CHE VUOLE L'UTENNTE E LA CALLBACK
  //E INVOCA LA CALBACK, E SI INVOCA LA CALLBACK PASSANDO UNULL E L'UTENTE.
   cb(null, user);
});

//LA DESERIALIZE USER SI FA OGNI VOLTA CHE VOGLIO FARE UN METODO CHE RICHIEDE CHE 
//SIA AUTENTICATO.

passport.deserializeUser(function (user, cb) { // this user is id + email + name
  return cb(null, user);
  // if needed, we can do extra check here (e.g., double check that the user is still in the database, etc.)
});


//OGNI VOLTA CHE VOGLIO CHE UN METODO SIA ACCESSIBILE SOLO DA UTENTI AUTENCIATI
//ESEGUO QUESTA FUNZIONE DI ISLOGGEDIN
const isLoggedIn = (req, res, next) => {
  //quando voglio che l'utente sia autenticato per accedere a una risorsa
  //uso questa funzione

  //QUESTO IS LOGGED IN VERIFICA SE E' TUTTO LEGGITTIMO, ALTRIMENTI RISPONDE CHE 
  //NON SIAMO AUTORIZZATI
  if(req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({error: 'Not authorized'});
}


app.use(session({
  secret: "shhhhh... it's a secret!",
  //uso questo secret per firmare il cookie di sessione
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.authenticate('session'));
//questo metodo lo posso copiare e serve solo per fare la sessione




/* ROUTE */

// GET /api/meme
//metodo che mi consente di ottenere un meme
app.get('/api/meme', (request, response) => {
  getAMeme()
  .then(meme => response.json(meme))
  .catch(() => response.status(500).end());
})

//metodo per ottenere il punteggio della scelta:
//GET /api/meme/:idM/didascalia/:idD
app.get('/api/meme/:idM/didascalia/:idd', (request, response) => {
  getPunteggio(request.params.idM, request.params.idd)
  .then(did => response.json(did))
  .catch(() => response.status(500).end());
})

//metodo per ottenere lo storico dei punteggi dell'utente:
//GET /api/user/

//metodo per ottenere due descrizioni corrette per il meme
// GET /api/meme
app.get('/api/meme/:id/correct', (request, response) => {
  getCorrectDid(request.params.id)
  .then(did => response.json(did))
  .catch(() => response.status(500).end());
})

//metodo per ottenere la storia dell'utente delle precedenti risposte
app.get('/api/history', (request, response) => {
  console.log("chiamata rest history", request.user.id)
  getHistory(request.user.id)
  .then(history => response.json(history))
  .catch(() => response.status(500).end());
})


//metodo per ottenere cinque descrizioni scorrette per
//un meme:

app.get('/api/meme/:id/uncorrect', (request, response) => {
  console.log("chiamata rest")
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

app.post('/api/sessions', function(req, res, next) {
  //QUESTO METODO ESEGUE L'AUTENTICAZIONE CHE ABBIAMO CONFIGURATO DENTRO 
  //PASSPORT.USE IN ALTO
    passport.authenticate('local', (err, user, info) => {
    //GLI DO IL PARAMTRO LOCAL PER DIRE CHE USO LA LOCAL STRATEGY
    //L'OGGETTO USER CHE NEL CASO IN CUI TUTTO VADA A BUON FINE VIENE RRESTITUITO
    //CON L'UTENTE AUTENTICATO

    //L'OGGETTO ERROR CHE VIENE RIEMPITO IN CASO DI ERRORE
    
    //INFO MANDA IL MESSAGGIO DI ERRORE CONFIGURATO PRIMA.
    if (err)
      return next(err);
      if (!user) {
        // display wrong login messages
        return res.status(401).send(info);
      }
      // success, perform the login
      //SE TUTTO VA A BUON FINE CHIAMO QUESTO METODO DI PASSPORT
      req.login(user, (err) => {
        if (err)
          return next(err);
        
        // req.user contains the authenticated user, we send all the user info back
        return res.status(201).json(req.user);
      });
  })(req, res, next);
});

// GET /api/sessions/current -- NEW
app.get('/api/sessions/current', (req, res) => {
  //se l'utente è autenticato restituisco l'utente
  if(req.isAuthenticated()) {
    res.json(req.user);}
  else
    res.status(401).json({error: 'Not authenticated'});
});

// DELETE /api/session/current -- NEW
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    res.end();
  });
});

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


//metodo post per CREARE un nuovo utente
app.post('/api/users', (request, response) => {
  const { nome, cognome, email, password, sale } = request.body;
  new Promise((resolve, reject) => {
    crypto.scrypt(password, sale, 32, (err, hashedPass) => {
      if (err) reject(err);
      else resolve(hashedPass.toString('hex'));
    });
  })
  .then(hashedPass => {
    console.log("hashedPass:", hashedPass)
    return createUser(nome, cognome, email, hashedPass, sale);
  })
  .then(user => response.json(user))
  .catch((err) => {
    console.error(err);  // Stampa l'errore nel console del server
    response.status(500).end();
  });
});



// far partire il server
app.listen(port, () => { console.log('API server started'); });