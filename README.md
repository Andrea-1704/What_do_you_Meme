[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/J0Dv0VMM)
# Exam #N: "What do you MEME"
## Student: s327644 MIRENDA ANDREA 

## React Client Application Routes

- Route `/`: main page.  
- Route `/login`: page that shows the login form
- Route `/play`: Page that allows each user (logged in and not) to play to a single round game
- Route `/user`: Page that shows the user informations
- Route `/loggedGame`: Page that allows to play for a logged-in player.

## API Server

### __Get a meme___
URL: `/api/meme`
HTTP Method: GET.

Description: Get a random meme.
Response: `200 OK` (success) or `500 Internal Server Error` (generic error).

Response body:

{
    "id": 1,
    "path": "meme1.url",
}

### ___Get score for a choice___

URL: `/api/meme/<idM>/didascalia/<idd>`
HTTP Method: GET.

Description: Retrive the score given the meme represented by `<idM>` and the caption id `<idd>`.
Response: `200 OK` (success) or `500 Internal Server Error` (generic error).

Response body:
{
  "score": 5
}


### ___Get a round given his id___

URL: `/api/round/<id>`
HTTP Method: GET.

Description: Retrive the round given his id represented by `<id>`.
Response: `200 OK` (success) or `500 Internal Server Error` (generic error).

Response body:
{
  "id": 1,
  "idMeme": 3,
  "idDidScelta": 4,
  "punteggio": 5
} 


### ___GET A MEME___

URL: `/api/meme/<id>`
HTTP Method: GET.

Description: Retrive the meme given his id represented by `<id>`.
Response: `200 OK` (success) or `500 Internal Server Error` (generic error).

Response body:
{
  "id": 1,
  "path": "meme1.png"
}


### ___GET THE CORRECT CAPTIONS FOR A MEME___

URL: `/api/meme/<id>/correct`
HTTP Method: GET.

Description: Retrive the correct captions for a meme given his id represented by `<id>`.
Response: `200 OK` (success) or `500 Internal Server Error` (generic error).

Response body:
```
[
  {
    "id": 1,
    "text": "Gatto che miagola"
  },
  ...
]
```


### ___GET THE HISTORY OF PLAYED GAMES___

URL: `/api/history`
HTTP Method: GET.

Description: Retrive the correct captions for a meme given his id represented by `<id>`.
Response: `200 OK` (success) or `500 Internal Server Error` (generic error).

Response body:
```
[
  {
    "id": 1,
    "idUser": 3,
    "idR1": 4,
    "idR2": 2,
    "idR3": 1,
    "punteggioTotale": 10,
    "date": "2024-02-07"
  },
  ...
]
```


### ___GET FIVE UNCORRECT CAPTIONS FOR A MEME___

URL: `/api/meme/<id>/uncorrect`
HTTP Method: GET.

Description: Retrive the correct captions for a meme given his id represented by `<id>`.
Response: `200 OK` (success) or `500 Internal Server Error` (generic error).

Response body:
```
[
  {
    "id": 1,
    "text": "Gatto che miagola"
  },
  ...
]
```

### ___GET THE CAPTION GIVEN HIS ID___

URL: `/api/didascalia/<id>`
HTTP Method: GET.

Description: Retrive the correct captions for a meme given his id represented by `<id>`.
Response: `200 OK` (success) or `500 Internal Server Error` (generic error).

Response body:
```
{
    "id": 1,
    "text": "Gatto che miagola"
}
```



### ___POST LOG REQUEST___

URL: `/api/sessions`
HTTP Method: POST.

Description: Allow to a user to log in.
Response: `201 Created` (success) or `401 Unauthorized` or `500 Internal Server Error ` (generic error).

Request body:
```
{

  "username": "username",
  "password": "password"

}
```

Response body:
```
{
  "id": "5f8e48e6a0542f001c5f7a26",
  "username": "username",
  "email": "user@example.com",
  "createdAt": "2024-06-27T12:00:00Z"
}
```


### ___Get current session information___

URL: `/api/sessions/current`

HTTP Method: GET

Description: Retrieve information about the current user session.

Response:
- `200 OK` if the user is authenticated and session information is retrieved successfully.
- `401 Unauthorized` if the user is not authenticated.

Response body :
```
{
  "id": 5,
  "nome": "username",
  "cognome": "cognome",
  "email": "user@example.com"
}
```


### ___Logout current session___

URL: `/api/sessions/current`

HTTP Method: DELETE

Description: Logout the current authenticated user session.

Response:
- `200 OK` if the logout is successful.




### ___REGISTER A ROUND___

URL: `/api/round`
HTTP Method: POST.

Description: Allow a user to register a round he played.
Response: `201 Created` (success) or `500 Internal Server Error ` (generic error).

Request body:
```
{

  "idMeme": 2,
  "idDid": 4

}
```

Response body:
```
{
  "associazioneId": 12345
}
```

### ___REGISTER A GAME___

URL: `/api/game`
HTTP Method: POST.

Description: Allow a user to register a game he played.
Response: `201 Created` (success)  or `500 Internal Server Error ` (generic error).

Request body:
```
{
  "idR1": 2,
  "idR2": 3,
  "idR3": 4
}
```

Response body:
```
{
  "associazioneId": 12345
}
```


## Database Tables

- Table `Associazione` - contains id idDid idMeme
- Table `Didascalia` - contains id didascalia
- Table `Game` - contains id idR1 idR2 idR3 date idUser punteggioTotale
- Table `Meme` - contains id nameUrl
- Table `Round` - contains id idMeme idDidScelta punteggio
- Table `User` - contains id name email password salt

## Main React Components

- `App` (in `App.jsx`): is the main page and defines all the routes of the application.
- `UserInfo` (in `UserInfo.jsx`): allows to show the info of the logged in user, including the history of the played games.
- `RandomMeme` (in `RandomMeme.jsx`): is the component that allows to play for a round.
- `GameLoggedIn` (in `GameLoggedIn.jsx`): is the component that allows to a logged in player to play a game composed of 3 rounds.

(only _main_ components, minor ones may be skipped)

## Screenshot

![Screenshot1](../esame_AW1/client/public/screenshot1.jpg)
![Screenshot2](../esame_AW1/client/public/screenshot2.jpg)

## Users Credentials

- luigi.derussis@polito.it, Password 
- s327644@studenti.polito.it, Password