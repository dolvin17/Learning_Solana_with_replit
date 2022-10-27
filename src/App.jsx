import React, { useEffect, useState } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';

// Constants
const TWITTER_HANDLE = 'Karol H';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const TEST_GIFS = [
  'https://static01.nyt.com/images/2022/01/06/business/05Techfix-illo/05Techfix-illo-jumbo.gif?quality=75&auto=webp',
  'https://ipfs.pixura.io/ipfs/QmX63fVPJinApLKZitBVonJDdktPVsmMJbMVVsJNwsgMn6/theShaman.gif'
]

const App = () => {
  // State
  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [gifList, setGifList] = useState([]);

  // Actions
  const checkIfWalletIsConnected = async () => {
    if (window?.solana?.isPhantom) {
      console.log('Phantom wallet found!');
      const response = await window.solana.connect({ onlyIfTrusted: true });
      console.log(
        'Connected with Public Key:',
        response.publicKey.toString()
      );
      setWalletAddress(response.publicKey.toString());
      
    } else {
      alert('Solana object not found! Get a Phantom Wallet 👻');
    }
  };

  /*
   * Let's define this method so our code doesn't break.
   * We will write the logic for this next!
   */
  const connectWallet = async () => {
  const { solana } = window;

  if (solana) {
    const response = await solana.connect();
    console.log('Connected with Public Key:', response.publicKey.toString());
    setWalletAddress(response.publicKey.toString());
  }
  };

  const sendGif = async () => {
  if (inputValue.length > 0) {
    console.log('Gif link:', inputValue);
    setGifList([...gifList, inputValue]);
    setInputValue('');
  } else {
    console.log('Empty input. Try again.');
  }
};


  const onInputChange = (event) => {
  const { value } = event.target;
  setInputValue(value);
};

  /*
   * We want to render this UI when the user hasn't connected
   * their wallet to our app yet.
   */
  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );
  
  const renderConnectedContainer = () => (
  <div className="connected-container">
    <form
      onSubmit={(event) => {
        event.preventDefault();
        sendGif();
      }}
    >
    <input
      type="text"
      placeholder="Enter gif link!"
      value={inputValue}
      onChange={onInputChange}
    />
    <button type="submit" className="cta-button submit-gif-button">
      Submit
    </button>
     </form>
  <div className="gif-grid">
  {/* Map through gifList instead of TEST_GIFS */}
    {gifList.map((gif) => (
    <div className="gif-item" key={gif}>
     <img src={gif} alt={gif} />
    </div>
    ))}
      </div>
    </div>
  );

  // UseEffects
  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  useEffect(() => {
  if (walletAddress) {
    console.log('Fetching GIF list...');
    
    // Call Solana program here.

    // Set state
    setGifList(TEST_GIFS);
  }
}, [walletAddress]);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <div className={walletAddress ? 'authed-container' : 'container'}>
          <p className="header"> ✨Portal de GIF al metaverso</p>
          <p className="sub-text">
            View your collection in the metaverse ✨
          </p>
          
          {/* Render your connect to wallet button right here */}
          {!walletAddress && renderNotConnectedContainer()}
          {walletAddress && renderConnectedContainer()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={'https://twitter.com/whatwedocolin'}
            target="_blank"
            rel="noreferrer"
          >{`developed by @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
     </div>
    </div>
  );
};

export default App;