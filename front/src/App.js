import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from './utils/WavePortal.json';

export default function App() {

  const [currentAccount, setCurrentAccount] = useState("");
  const [totalWaves, setTotalWaves] = useState("");
  const [allWaves, setAllWaves] = useState([]);
  const [message, setMessage] = useState("");

  const contractAddress = "0xA4c9eDf1E78383a6511A516A39cb28b030Fe21e4";

  const contractABI = abi.abi;

  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);

        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        const waves = await wavePortalContract.getAllWaves();

        let wavesCleaned = [];
        waves.forEach((wave) => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp*1000),
            message: wave.message
          });
        });
        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object does not exist!")
      }
    } catch(error) {
      console.log(error);
    }
  }
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Ohow... Please make sure you are using Metamask!");
        return;
      } else {
        console.log("Nice, look at this beautiful ethereum object...", ethereum);
        await getAllWaves();
      }

      const accounts = await ethereum.request({method: 'eth_accounts'});
      
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);

        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
        setTotalWaves(count.toNumber());
        
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
    

  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Please use Metamask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts"});

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }
  
  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        const waveTxn = await wavePortalContract.wave(message);
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined --", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        getAllWaves();

        console.log("Retrieved total wave count...", count.toNumber());
        setTotalWaves(count.toNumber());

      } else {
        console.log("Ethereum object does not exist!")
      }
    } catch(error) {
      console.log(error);
    }
    
  }
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  const handleChange = (event) => {
    setMessage(event.target.value);
  }
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👋 Hey there!
        </div>

        <div className="bio">
        I am Florian and I'm building stuff in the Cloud.
        Connect your Ethereum wallet and wave at me!
        </div>
        <textarea value={message} onChange={handleChange} />
        <button className="waveButton" onClick={wave}>
          Wave at Me! (and get 0.0001 ETH!)
        </button>

        {totalWaves && (<p className="text">{ totalWaves } people already waved at me here! Please join them!</p>)}

        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
        {allWaves.reverse().map((wave, index) => {
          return (
            <div key={index} style={{ backgroundColor: "#55BCC9", marginTop: "16px", padding: "8px", color: "#edf5e1"}}>
              <div>Adress: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
