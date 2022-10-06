import "./App.css";
import Navbar from "./components/navbar/Navbar";
import Web3 from "web3";
import configuration from "./Coupons.json";
import { useState } from "react";
import couponImage from "./images/coupon.png";

function App() {
  const [activeAccount, setActiveAccount] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const [couponsArray, setCouponsArray] = useState([]);

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
      await displayCoupons();
    } else {
      setErrorMessage(
        "Please install the Metamask browser extension to interact"
      );
    }
  };
  let totalCoupons = 30;
  let emptyAddress = "0x0000000000000000000000000000000000000000";
  const displayCoupons = async () => {
    for (let i = 0; i < totalCoupons; i++) {
      const coupon = await contract.methods.coupons(i).call();
      if (coupon.owner === emptyAddress) {
        setCouponsArray((couponsArray) => [...couponsArray, coupon]);
      }
    }
  };
  const buyCoupon = async (singleCoupon) => {
    await contract.methods
      .buyCoupon(singleCoupon.id)
      .send({ from: activeAccount, value: singleCoupon.price });
  };
  return (
    <>
      <Navbar></Navbar>
      <div className="text-center bg-black min-h-screen">
        <h4 className="text-3xl text-red-300 py-4 font-serif font-extrabold">
          Buy a coupon and get 25% off.<br></br>Get connected with your wallet.
        </h4>
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
        <div className="container py-10 mx-auto grid lg:grid-cols-3 gap-8">
          {couponsArray.map((singleCoupon) => (
            <div
              key={singleCoupon.id}
              className="max-w-sm bg-black rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700"
            >
              <a>
                <img
                  src={couponImage}
                  className="rounded-t-lg"
                  style={{ height: "427px", width: "600px" }}
                  alt=""
                />
              </a>
              <div className="p-5">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Finxter Premium Membership Coupon
                </h5>
                <h5 className="mb-0 text-xl font-serif font-semibold tracking-tight text-gray-900 dark:text-cyan-600">
                  Coupon ID: {singleCoupon.id}
                </h5>
                <h5 className="mb-2 text-xl font-serif font-semibold tracking-tight text-gray-900 dark:text-cyan-600">
                  Price: {singleCoupon.price / 1e18} Eth
                </h5>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                  Avail the biggest discount of the year and join as a premium
                  member
                </p>
                <button
                  type="button"
                  onClick={() => buyCoupon(singleCoupon)}
                  className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-md px-5 py-2.5 text-center mr-2 mb-2"
                >
                  BUY NOW
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
