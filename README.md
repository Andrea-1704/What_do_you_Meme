# 🎮 Exam Project: "What do you MEME"
## 👤 Student: s327644 - Andrea Mirenda

## 🚀 Project Overview
"What do you MEME" is a web application built using **React** that allows users to play a meme-based game. Users can play single rounds, while logged-in players can participate in full games consisting of multiple rounds. The application supports user authentication, game history tracking, and an interactive gameplay experience.

---

## 🌐 React Client Application Routes

- **`/`** - Main page
- **`/login`** - Login page
- **`/play`** - Play a single-round game (available for all users)
- **`/user`** - Displays user information and game history
- **`/loggedGame`** - Play a multi-round game (for logged-in users)

---

## 📡 API Endpoints

### 🔹 Retrieve a Random Meme
- **URL:** `/api/meme`
- **Method:** `GET`
- **Response:** `200 OK` (success) or `500 Internal Server Error`
- **Response Body:**
  ```json
  {
      "id": 1,
      "path": "meme1.url"
  }
  ```

### 🔹 Get Score for a Choice
- **URL:** `/api/meme/<idM>/didascalia/<idd>`
- **Method:** `GET`
- **Response:** `200 OK` (success) or `500 Internal Server Error`
- **Response Body:**
  ```json
  {
      "score": 5
  }
  ```

### 🔹 Get a Game Round by ID
- **URL:** `/api/round/<id>`
- **Method:** `GET`
- **Response:** `200 OK` (success) or `500 Internal Server Error`
- **Response Body:**
  ```json
  {
      "id": 1,
      "idMeme": 3,
      "idDidScelta": 4,
      "punteggio": 5
  }
  ```

### 🔹 Retrieve a Meme by ID
- **URL:** `/api/meme/<id>`
- **Method:** `GET`
- **Response:** `200 OK` (success) or `500 Internal Server Error`
- **Response Body:**
  ```json
  {
      "id": 1,
      "path": "meme1.png"
  }
  ```

### 🔹 Get Correct Captions for a Meme
- **URL:** `/api/meme/<id>/correct`
- **Method:** `GET`
- **Response:** `200 OK` (success) or `500 Internal Server Error`
- **Response Body:**
  ```json
  [
    {
      "id": 1,
      "text": "Gatto che miagola"
    }
  ]
  ```

### 🔹 Retrieve Game History
- **URL:** `/api/history`
- **Method:** `GET`
- **Response:** `200 OK` (success) or `500 Internal Server Error`
- **Response Body:**
  ```json
  [
    {
      "id": 1,
      "idUser": 3,
      "idR1": 4,
      "idR2": 2,
      "idR3": 1,
      "punteggioTotale": 10,
      "date": "2024-02-07"
    }
  ]
  ```

### 🔹 Retrieve Incorrect Captions for a Meme
- **URL:** `/api/meme/<id>/uncorrect`
- **Method:** `GET`
- **Response:** `200 OK` (success) or `500 Internal Server Error`

### 🔹 Get Caption by ID
- **URL:** `/api/didascalia/<id>`
- **Method:** `GET`
- **Response:** `200 OK` (success) or `500 Internal Server Error`
- **Response Body:**
  ```json
  {
      "id": 1,
      "text": "Gatto che miagola"
  }
  ```

### 🔹 User Authentication Endpoints
#### 🔸 Login Request
- **URL:** `/api/sessions`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "username": "username",
    "password": "password"
  }
  ```
- **Response:** `201 Created` (success), `401 Unauthorized`, or `500 Internal Server Error`

#### 🔸 Get Current Session Info
- **URL:** `/api/sessions/current`
- **Method:** `GET`
- **Response:** `200 OK` or `401 Unauthorized`

#### 🔸 Logout
- **URL:** `/api/sessions/current`
- **Method:** `DELETE`
- **Response:** `200 OK` (successful logout)

### 🔹 Register a Game Round
- **URL:** `/api/round`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
      "idMeme": 2,
      "idDid": 4
  }
  ```
- **Response:** `201 Created` (success) or `500 Internal Server Error`

### 🔹 Register a Game
- **URL:** `/api/game`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
      "idR1": 2,
      "idR2": 3,
      "idR3": 4
  }
  ```
- **Response:** `201 Created` (success) or `500 Internal Server Error`

---

## 📊 Database Schema

- **`Associazione`**: Stores meme-caption associations
- **`Didascalia`**: Stores captions
- **`Game`**: Stores user game sessions
- **`Meme`**: Stores memes and their metadata
- **`Round`**: Stores individual game rounds
- **`User`**: Stores user accounts and credentials

---

## 🏗️ Main React Components

- **`App.jsx`** - Main application structure and route definitions
- **`UserInfo.jsx`** - Displays user information and game history
- **`RandomMeme.jsx`** - Allows users to play a single round
- **`GameLoggedIn.jsx`** - Manages a multi-round game for logged-in users

---

## 🔑 Test User Credentials

- **Email:** luigi.derussis@polito.it, **Password:** [hidden]
- **Email:** s327644@studenti.polito.it, **Password:** [hidden]

---

## 📜 License
This project is developed as part of an academic exam and is subject to university policies.

---

🚀 **Enjoy playing "What do you MEME"!**

