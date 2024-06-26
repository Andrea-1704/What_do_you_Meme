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
  console.log("response error logout", response)
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
}

const fetchMeme = async () => {
  // const response = await fetch(SERVER_URL + '/api/meme');
  //   if (!response.ok) {
  //     throw new Error('Failed to fetch meme');
  //   }
  //   const meme = await response.json();
  // return meme;

  return await fetch(SERVER_URL + '/api/meme')
  .then(handleInvalidResponse)
  .then((response) => response.json());
  
};

const fetchDidascalieScorrette = async (memeId) => {
  console.log("didascalie scorrette", memeId);
  const response = await fetch(SERVER_URL + `/api/meme/${memeId}/uncorrect`);
    if (!response.ok) {
      throw new Error('Failed to fetch didascalie');
    }
    const didascalie = await response.json();
  return didascalie;
  
};
const fetchDidascalieCorrette = async (memeId) => {
  console.log("didascalie corrette", memeId);
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


const sendRound = async (meme, didascalia, idCor1, idCor2) => {
  
  // const response = await fetch(SERVER_URL + '/api/round', {
  //   method: 'POST',
  //   credentials: 'include',
  //   headers: {'Content-Type': 'application/json'},
  //   body: JSON.stringify({idMeme: meme, idDid: didascalia, idDidCor1: idCor1, idDidCor2: idCor2}),
  // });
  
  // const idRound = await response.json();
  // if (response.ok) {
  //   return idRound;
  // } else {
  //   throw idRound;  
  // }

  return await fetch(SERVER_URL + '/api/round', {
    method: 'POST',
    credentials: 'include',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({idMeme: meme, idDid: didascalia, idDidCor1: idCor1, idDidCor2: idCor2}),
  })
.then(handleInvalidResponse)
.then((response) => response.json());
};

const sendGame = async (idR1, idR2, idR3) => {
  // console.log("dati ricevuti dentro api", idR1, idR2, idR3)
  // const response = await fetch(SERVER_URL + '/api/game', {
  //   method: 'POST',
  //   credentials: 'include',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({idR1: idR1, idR2: idR2, idR3: idR3}),
  // });
  // const idGame = await response.json();
  // if (response.ok) {
  //   return idGame;
  // } else {
  //   throw idGame;  
  // }
  return await fetch(SERVER_URL + '/api/game', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({idR1: idR1, idR2: idR2, idR3: idR3}),
   })
  .then(handleInvalidResponse)
  .then((response) => response.json());
};

//metodo che chiama la get all'indirizzo '/api/round/:id':
const getRoundById = async (id) => {
  /*
  const response = await fetch(SERVER_URL + `/api/round/${id}`);
  if(!response.ok){
    throw new Error('Failed to fetch round');
  }
  const round=await response.json();
  return round;*/
  return await fetch(SERVER_URL + `/api/round/${id}`)
  .then(handleInvalidResponse)
  .then((response) => response.json());
}

//metodo per ottenere un meme dato il suo id:
const getMemeById = async (id) => {

  return await fetch(SERVER_URL + `/api/meme/${id}`)
  .then(handleInvalidResponse)
  .then((response) => response.json());

  // const response = await fetch(SERVER_URL + `/api/meme/${id}`);
  // if(!response.ok){
  //   throw new Error('Failed to fetch meme');
  // }
  // const meme=await response.json();
  // return meme;
}

//metodo per ottenere una didascalia dato il suo id:
const getDidascaliaById = async (id) => {
  return await fetch(SERVER_URL + `/api/didascalia/${id}`)
  .then(handleInvalidResponse)
  .then((response) => response.json());
}

// const getHistory = async () => {
//   return await fetch(SERVER_URL + /api/history, {
//     credentials: "include",
//   })
//     .then(handleInvalidResponse)
//     .then((response) => response.json());
// };

function handleInvalidResponse(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  let type = response.headers.get("Content-Type");
  if (type !== null && type.indexOf("application/json") === -1) {
    throw new TypeError(`Expected JSON, got ${type}`);
  }
  return response;
}



const API = {logIn, logOut, getHistory,getPunteggio, getUserInfo, fetchMeme, fetchDidascalieScorrette, fetchDidascalieCorrette, sendRound, sendGame, getRoundById, getMemeById, getDidascaliaById};
export default API;