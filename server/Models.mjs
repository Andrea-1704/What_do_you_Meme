/* Same of week 03, but without any internal methods */
import dayjs from 'dayjs';

function Meme(id, path) {
  this.id = id;
  this.path=path;
}

function Game(id, idUser, idR1, idR2, idR3, punteggioTotale, date) {
  this.id = id;
  this.idUser = idUser;
  this.idR1 = idR1;
  this.idR2 = idR2;
  this.idR3 = idR3;
  this.punteggioTotale=punteggioTotale
  this.date = dayjs(date);
}

function Round(id, idMeme, idDidScelta, punteggio) {
    this.id = id;
    this.idMeme = idMeme;
    this.idDidScelta = idDidScelta;
    this.idPunteggio = punteggio;
}

function Didascalia(id, testo) {
    this.id = id;
    this.testo = testo;
}

function Associazione(id, idMeme, idDid) {
    this.id = id;
    this.idMeme = idMeme;
    this.idDid = idDid;
}

function User(id, name, email, password) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
}
  
export {  Game , Round, User, Meme, Didascalia, Associazione};