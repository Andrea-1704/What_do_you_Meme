import { useState } from 'react';
import API from '../API.mjs';

function RandomMeme() {
  const [meme, setMeme] = useState(null);
  const [error, setError] = useState(null);

  API.fetchMeme();
  
  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!meme) {
    return <div>Loading...</div>;
  }
  console.log(meme.path)

  return (
    <div>
      <h1>Random Meme</h1>
      <img src={meme.path} alt={meme.id} />
      <p>{meme.id}</p>
    </div>
  );
}

export default RandomMeme;
