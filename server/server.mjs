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
  addDidascalia, addAssociazione 
} from './Dao.mjs';

// init
const app = express();
const port = 3001;

// middleware
app.use(express.json());
app.use(morgan('dev'));

const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
  credentials: true
};
app.use(cors(corsOptions));

// session middleware
app.use(session({
  secret: "shhhhh... it's a secret!",
  resave: false,
  saveUninitialized: false,
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Passport: set up local strategy
passport.use(new LocalStrategy(async (username, password, done) => {
  console.log("dentro verify");
  try {
    const user = await getUser(username, password);
    if (!user) {
      return done(null, false, { message: 'Incorrect username or password.' });
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  return done(null, user);
});

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: 'Not authorized' });
};

//QUESTA E' UNA PARTE COPIABILE.
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

//metodo per ottenere due descrizioni corrette per il meme
// GET /api/meme
app.get('/api/meme/:id/correct', (request, response) => {
  getCorrectDid(request.params.id)
  .then(did => response.json(did))
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

// POST /api/sessions -- 
//questa funzione mi consente di effettuare il login di un utente
app.post('/api/sessions', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).send(info);
    }
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
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
  const { name, surname, email, password, salt } = request.body;

  new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 32, (err, hashedPass) => {
      if (err) reject(err);
      else resolve(hashedPass.toString('hex'));
    });
  })
  .then(hashedPass => {
    return createUser(name, surname, email, hashedPass, salt);
  })
  .then(user => response.json(user))
  .catch((err) => {
    console.error(err);  // Stampa l'errore nel console del server
    response.status(500).end();
  });
});



// far partire il server
app.listen(port, () => { console.log('API server started'); });