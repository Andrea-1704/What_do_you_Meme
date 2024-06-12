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

const API = {logIn, logOut, getUserInfo, fetchMeme};
export default API;