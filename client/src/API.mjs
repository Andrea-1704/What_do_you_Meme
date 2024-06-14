//qui andiamo a mettere tutte le funzioni che ci servono per fare le chiamate al server,
//ovvero è qui che andiamo a mettere le funzioni di fetch:

//import {  Game , Round, User, Meme, Didascalia, Associazione} from './Models.mjs';

const SERVER_URL = 'http://localhost:3001';


const logIn = async (credentials) => {
  const response = await fetch(SERVER_URL + '/api/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(credentials),
  });
  if(response.ok) {
    const user = await response.json();
    return user;
  }
  else {
    const errDetails = await response.text();
    throw errDetails;
  }
};


const getUserInfo = async () => {
  const response = await fetch(SERVER_URL + '/api/sessions/current', {
    credentials: 'include',
  });
  const user = await response.json();
  if (response.ok) {
    return user;
  } else {
    throw user;  
  }
};

const logOut = async() => {
  const response = await fetch(SERVER_URL + '/api/sessions/current', {
    method: 'DELETE',
    credentials: 'include'
  });
  if (response.ok)
    return null;
}

const fetchMeme = async () => {
  const response = await fetch(SERVER_URL + '/api/meme');
    if (!response.ok) {
      throw new Error('Failed to fetch meme');
    }
    const meme = await response.json();
  return meme;
  
};

const fetchDidascalieScorrette = async (memeId) => {
  
  const response = await fetch(SERVER_URL + `/api/meme/${memeId}/uncorrect`);
    if (!response.ok) {
      throw new Error('Failed to fetch didascalie');
    }
    const didascalie = await response.json();
  return didascalie;
  
};
const fetchDidascalieCorrette = async (memeId) => {
  const response = await fetch(SERVER_URL + `/api/meme/${memeId}/correct`);
    if (!response.ok) {
      throw new Error('Failed to fetch didascalie');
    }
    const didascalie = await response.json();
  return didascalie;
  
};

//metodo che chiama la get all'indirizzo '/api/meme/:idM/didascalia/:idd':
const getPunteggio = async(memeId, didId) => {
  const response = await fetch(SERVER_URL + `/api/meme/${memeId}/didascalia/${didId}`);
  if(!response.ok){
    throw new Error('Failed to fetch score');
  }
  const punteggio=await response.text();
  return punteggio;
}



const API = {logIn, logOut, getPunteggio, getUserInfo, fetchMeme, fetchDidascalieScorrette, fetchDidascalieCorrette};
export default API;