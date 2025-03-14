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


const getHistory = async (credentials) => {
  const response = await fetch(SERVER_URL + '/api/history', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(credentials),
  });
  if(response.ok) {
    const storia = await response.json();
    return storia;
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
  // return await fetch(SERVER_URL + '/api/sessions/current', {
  //   method: 'DELETE',
  //   credentials: 'include'
  // })
  // .then(handleInvalidResponse)
  // .then((response) => response.json());
  else {
    const errDetails = await response.text();
    throw errDetails;
  }
}

const fetchMeme = async () => {
  const response = await fetch(SERVER_URL + '/api/meme');
    if (!response.ok) {
      throw new Error('Failed to fetch meme');
    }
    const meme = await response.json();
  return meme;

  // return await fetch(SERVER_URL + '/api/meme')
  // .then(handleInvalidResponse)
  // .then((response) => response.json());
  
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


const sendRound = async (meme, didascalia) => {
  
  const response = await fetch(SERVER_URL + '/api/round', {
    method: 'POST',
    credentials: 'include',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({idMeme: meme, idDid: didascalia}),
  });
  if (!response.ok) {
    const errMessage = await response.json();
    throw errMessage;
  }
  const idRound = await response.json();
  return idRound;
  

//   return await fetch(SERVER_URL + '/api/round', {
//     method: 'POST',
//     credentials: 'include',
//     headers: {'Content-Type': 'application/json'},
//     body: JSON.stringify({idMeme: meme, idDid: didascalia, idDidCor1: idCor1, idDidCor2: idCor2}),
//   })
// .then(handleInvalidResponse)
// .then((response) => response.json());
};

const sendGame = async (idR1, idR2, idR3) => {
  const response = await fetch(SERVER_URL + '/api/game', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({idR1: idR1, idR2: idR2, idR3: idR3}),
  });
  
  if (response.ok) {
    const idGame = await response.json();
    return idGame;
  } else {
    const errMessage = await response.json();
    throw errMessage;  
  }
  //  const response = await fetch(SERVER_URL + '/api/game', {
  //     method: 'POST',
  //     credentials: 'include',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({idR1: idR1, idR2: idR2, idR3: idR3}),
  //  });
  //  const idGame=await response.json();
  //  if(response.ok) {
  //    return idGame;
  //  }else{
  //   throw idGame;
  //  }
};

//metodo che chiama la get all'indirizzo '/api/round/:id':
const getRoundById = async (id) => {
  
  const response = await fetch(SERVER_URL + `/api/round/${id}`);
  if(!response.ok){
    throw new Error('Failed to fetch round');
  }
  const round=await response.json();
  return round;
}

//metodo per ottenere un meme dato il suo id:
const getMemeById = async (id) => {
  const response = await fetch(SERVER_URL + `/api/meme/${id}`);
  if(!response.ok){
    throw new Error('Failed to fetch meme');
  }
  const meme=await response.json();
  return meme;
}

//metodo per ottenere una didascalia dato il suo id:
const getDidascaliaById = async (id) => {
  const response= await fetch(SERVER_URL + `/api/didascalia/${id}`);
  if(!response.ok){
    throw new Error('Failed to fetch didascalia');
  }return await response.json();
}





const API = {logIn, logOut, getHistory,getPunteggio, getUserInfo, fetchMeme, fetchDidascalieScorrette, fetchDidascalieCorrette, sendRound, sendGame, getRoundById, getMemeById, getDidascaliaById};
export default API;