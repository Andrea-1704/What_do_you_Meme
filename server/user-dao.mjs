/**  NEW **/
import { db } from './db.mjs';
import crypto from 'crypto';

//getUser E' IL METODCO CHE VIENE USATO OGNI VOLTA CHE 
//FACCIO IL LOGIN E CERCA L'UTENTE IN BASE ALLA EMAIL.
export const getUser = (email, password) => {
  return new Promise((resolve, reject) => {
    console.log("query")
    const sql = 'SELECT * FROM user WHERE email = ?';
    
    db.get(sql, [email], (err, row) => {
      if (err) { 
        reject(err); 
      }
      else if (row === undefined) { 
        resolve(false); 
      }
      else {
        //SE L'UTENTRE ESISTE DEVO GENERARE L'HASH CRITTOGRAFICO
        //NOTA BENE :IL SALE DEVE ESSERE MEMORIZZATO ALL'INTERNO DEL DATABASE.
        //QUYINDI ONGI VOLTA CHE FACCIO LA CREAZIONE DI UN  UTENTE NEL DB DEVO 
        //ANCHE ANDARE A MEMORIZZARE IL SALE CON CUI GENERARE L'HASH.
        const user = {id: row.id, username: row.email, name: row.name};
        //se l'utente esiste faccio l'hash crittografico per verificare la corrispondenza della password
        
        //NB: QUESTA E' LA FUNZIONE CHE DEVE CALCOLARE L'HASH CRITTOGRAFICO:
        //QUINDI IN PRATICA NEL DB DEVO AVERE LA FUNZIONE GIA' HASCHIZZATA
        //E IL SALE.
        crypto.scrypt(password, row.salt, 64, function(err, hashedPassword) {
          if (err) reject(err);
          if(!crypto.timingSafeEqual(Buffer.from(row.password, 'hex'), hashedPassword))
            resolve(false);
          else
            //SE LA PASSWORD E' CORRETTA RESTITUISCO L'UTENTE
            //PERO' ATTENZIONE: DENTRO L'OGGETTO UTENTE NON METO LA PASSWORD
            //SAREBBE L'ERRORE PIU' SCEMO CHE POTRESTI FARE.
            resolve(user);
        });
      }
    });
  });
};


//QUESTO METODO MI SERVE IBN GENERE PER VEDERE CHE L'UTENTE E' AUTENTICATO
//OVVERO CHE NON SIA STATO ANCORA CANCELLATO
//NON E' UN METODO RICHIESTO DALL'UTENTE MA DAL SERVER 
export const getUserById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM user WHERE id = ?';
    db.get(sql, [id], (err, row) => {
      if (err) { 
        reject(err); 
      }
      else if (row === undefined) { 
        resolve({error: 'User not found!'}); 
      }
      else {
        const user = {id: row.id, username: row.email, name: row.name};
        resolve(user);
      }
    });
  });
};