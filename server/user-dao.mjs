/**  NEW **/
//import { db } from './db.mjs';
import crypto from 'crypto';
import sqlite from 'sqlite3';

const db = new sqlite.Database('db.db', (err) => {
    if (err) throw err;
  });
//getUser cerca un utente nel db tramite la mail
export const getUser = (email, password) => {
  //onsole.log(email, password)
  return new Promise((resolve, reject) => {
    console.log(email, password);
    const sql = 'SELECT * FROM user WHERE email = ?';
    
    db.get(sql, [email], (err, row) => {
      if (err) { 
        reject(err); 
      }
      else if (row === undefined) { 
        resolve(false); 
      }
      else {
        const user = {id: row.id, username: row.email, name: row.name};
        //se l'utente esiste faccio l'hash crittografico per verificare la corrispondenza della password
        crypto.scrypt(password, row.salt, 32, function(err, hashedPassword) {
          if (err) reject(err);
          if(!crypto.timingSafeEqual(Buffer.from(row.password, 'hex'), hashedPassword))
            resolve(false);
          else
            resolve(user);
        });
      }
    });
  });
};

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