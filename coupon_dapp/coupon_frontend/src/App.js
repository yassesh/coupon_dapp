import "./App.css";
import Navbar from "./components/navbar/Navbar";
import Web3 from "web3";
import configuration from "./Coupons.json";
import { useState } from "react";

function App() {
  const [activeAccount, setActiveAccount] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const contractAddress = configuration.networks["5777"].address;
  const contractABI = configuration.abi;

  const web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:7545");

  const contract = new web3.eth.Contract(contractABI, contractAddress);

  const connectWalletHandler = async () => {
    if (window.ethereum) {
      var web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });

      var accounts = await web3.eth.getAccounts();
      const myAccount = accounts[0];
      setActiveAccount(myAccount);
    } else {
      setErrorMessage(
        "Please install the Metamask browser extension to interact"
      );
    }
  };

  return (
    <>
      <Navbar></Navbar>
      <div className="text-center">
        <button
          type="button"
          onClick={connectWalletHandler}
          className="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-2xl px-5 py-2.5 text-center mr-2 mb-2"
        >
          Connect to Metamask
        </button>
        <div className="items-center mt-5 py-3 px-4 font-medium text-center text-white bg-red-500 rounded-lg hover:bg-red-500 focus:ring-4 focus:outline-none focus:ring-blue-300">
          <h3 className="text-2xl">Address: {activeAccount}</h3>
        </div>
        {errorMessage}
      </div>
    </>
  );
}

export default App;
