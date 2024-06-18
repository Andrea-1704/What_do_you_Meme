/* Data Access Object (DAO) module for accessing Q&A */
/* Initial version taken from exercise 4 (week 03) */

import sqlite from 'sqlite3';
import { Game , Round, User, Meme, Didascalia, Associazione} from './Models.mjs';

// open the database
const db = new sqlite.Database('db.db', (err) => {
  if (err) throw err;
});

/** MEME **/
// get a random meme
export const getAMeme = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM meme ORDER BY RANDOM() LIMIT 1';
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        if (rows.length > 0) {
          const row = rows[0];
          const meme = new Meme(row.id, row.nameUrl);
          console.log(meme.path)
          resolve(meme);
        } else {
          resolve(null);  // Nessun meme trovato
        }
      }
    });
  });
};

export const getDidascaliaById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM didascalia WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
      if (err) {
        reject(err);
      } else {
        if (row) {
          const didascalia = `didascalia: ${row.didascalia}`;
          resolve(didascalia);
        } else {
          resolve(null);
        }
      }
    });
  });
}



/** DIDASCALIE **/
// ottieni due didascalie corrette, solo se sono presenti almeno due didascalie per il meme
export const getCorrectDid = (idMeme) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT Didascalia.id, Didascalia.didascalia 
                   FROM Associazione 
                   JOIN Didascalia ON Associazione.idDid = Didascalia.id 
                   WHERE Associazione.idMeme = ?
                   LIMIT 2`;
      db.all(sql, [idMeme], (err, rows) => {
        if (err) {
          reject(err);
        } else if (rows.length < 2) {
          resolve({error: "Non ci sono abbastanza didascalie per questo meme."});
        } else {
          console.log(rows);
          const didascalie = rows.map(row => new Didascalia(row.id, row.didascalia));
          resolve(didascalie);
        }
      });
    });
  }

  //ottieni 5 didascalie scorrette per il meme
  export const getUncorrectDid = (idMeme) => {
    console.log("dao")
    return new Promise((resolve, reject) => {
      const sql = `SELECT Didascalia.id, Didascalia.didascalia 
                   FROM Didascalia 
                   WHERE Didascalia.id NOT IN (
                     SELECT Associazione.idDid 
                     FROM Associazione 
                     WHERE Associazione.idMeme = ?
                   )`;
      db.all(sql, [idMeme], (err, rows) => {
        if (err) {
          reject(err);
        } else if (rows.length < 5) {
          resolve({error: "Non ci sono abbastanza didascalie scorrette per questo meme."});
        } else {
          const didascalie = rows.map(row => new Didascalia(row.id, row.didascalia));
          resolve(didascalie);
        }
      });
    });
  }
  
/** GIOCO **/
//registra un gioco
export const punteggioTotale = (idR1, idR2, idR3) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT SUM(punteggio) as total FROM Round WHERE id IN (?, ?, ?)`;
    db.get(sql, [idR1, idR2, idR3], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row.total);
      }
    });
  });
};//visto

export const addGame = async (idUser, idR1, idR2, idR3) => {
  try {
    // Calcola il punteggio totale
    const punteggioTotale = await punteggioTotale(idR1, idR2, idR3);
    
    // Inserisci i dati nel database
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO game (idUser, idR1, idR2, idR3, punteggioTotale, date) VALUES (?, ?, ?, ?, ?, datetime('now'))`;
      db.run(sql, [idUser, idR1, idR2, idR3, punteggioTotale], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID); // id dell'ultima riga inserita nella tabella
        }
      });
    });
  } catch (err) {
    throw err;
  }
};

  


/** ROUND **/
//getPunteggio:
export const getPunteggio = (idMeme, idDid) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM Associazione WHERE idMeme = ? AND idDid = ?`;
      db.get(sql, [idMeme, idDid], (err, row) => {
        if (err) {
          reject(err);
        } else {
          if (row) {
            resolve(5);
          } else {
            resolve(0);
          }
        }
      });
    });
  }
  
//crea un  utente:
export const createUser = (nome, cognome, mail, password, sale) => {
  console.log(nome, cognome, mail, password, sale)
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO user (Nome, Cognome, email, password, sale) VALUES (?, ?, ?, ?, ?)`;
    db.run(sql, [nome, cognome, mail, password, sale], function(err) {
      if (err)
        reject(err);
      else
        resolve(this.lastID);
    });
  });
}

//registra un round
export const addRound = (idMeme, idDidS, idDidC1, idDidC2, punteggio) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO round (idMeme, idDid, punteggio) VALUES (?, ?, ?)`;
    db.run(sql, [idMeme, idDidS, idDidC1, idDidC2, punteggio], function(err) {
      if (err)
        reject(err);
      else
        resolve(this.lastID);
    });
  });
}

//getRound
export const getRound = (idRound) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM round WHERE id = ?`;
    db.get(sql, [idRound], (err, row) => {
      if (err)
        reject(err);
      else {
        const round = new Round(row.id, row.idMeme, row.idDidScelta, row.punteggio, row.idDidC1, row.idDidC2);
        resolve(round);
      }
    });
  });
}

//getHistory
export const getHistory = (idUser) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM game WHERE idUser = ?`;
    db.all(sql, [idUser], (err, rows) => {
      if (err)
        reject(err);
      else {
        const games = rows.map(row => new Game(row.id, row.idUser, row.idR1, row.idR2, row.idR3, row.punteggioTotale, row.date));
        resolve(games);
      }
    });
  });
}

//get round by id
export const getRoundById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM round WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
      if (err)
        reject(err);
      else {
        const round = new Round(row.id, row.idMeme, row.idDidScelta, row.punteggio, row.idDidC1, row.idDidC2);
        resolve(round);
      }
    });
  });
}


//METODI PER RIEMPIRE IL DATABASE:
export const createMeme = (meme) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO meme (nameUrl) VALUES (?)`;
    db.run(sql, [meme.path], function(err) {
      console.log("meme.path:", meme.path);
      if (err) {
        console.error("Errore durante l'inserimento nel database:", err.message);
        reject(err);
      } else {
        console.log("Inserimento riuscito, ID del meme:", this.lastID);
        resolve(this.lastID);
      }
    });
  });
};

//metodo per aggiungere una didascalia
export const addDidascalia = (didascalia) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO didascalia (didascalia) VALUES (?)`;
    db.run(sql, [didascalia], function(err) {
      if (err) {
        console.error("Errore durante l'inserimento nel database:", err.message);
        reject(err);
      } else {
        console.log("Inserimento riuscito, ID della didascalia:", this.lastID);
        resolve(this.lastID);
      }
    });
  });
};

//metodo per associare una didascalia a un meme
export const addAssociazione = (idMeme, idDid) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO associazione (idMeme, idDid) VALUES (?, ?)`;
    console.log("idMeme:", idMeme, "idDid:", idDid);
    db.run(sql, [idMeme, idDid], function(err) {
      if (err) {
        console.error("Errore durante l'inserimento nel database:", err.message);
        reject(err);
      } else {
        console.log("Inserimento riuscito, ID dell'associazione:", this.lastID);
        resolve(this.lastID);
      }
    });
  });
};


