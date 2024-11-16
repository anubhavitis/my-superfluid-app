"use client";
import { BrowserProvider } from "ethers";
import { useState } from "react";
import { Address } from "viem";
import Details from "./components/userDetails";
import CreateStream from "./components/createStream";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function Home() {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [account, setAccount] = useState("" as Address);
  const [message, setMessage] = useState("");

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new BrowserProvider(window.ethereum);
        setProvider(provider);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccount("0x2CeADe86A04e474F3cf9BD87208514d818010627" as Address);
        // setAccount(address as Address);
        setMessage(`Connected to ${address}`);
      } catch (error) {
        console.error("Failed to connect wallet:", error);
        setMessage("Failed to connect wallet. Please try again.");
      }
    } else {
      setMessage("Please install Metamask to use this feature.");
    }
  };

  return (
    <div className="p-20 mx-auto">
      <h1 className="p-4 my-10 text-xl font-bold text-center rounded-md">
        Welcome to Trust Squared v0
      </h1>

      {!account ? (
        <div className="flex justify-center">
          <button
            onClick={connectWallet}
            className="p-4 bg-blue-600 text-white rounded-md border-none cursor-pointer"
          >
            Connect Wallet
          </button>
        </div>
      ) : (
        <div>
          <div>
            {message && (
              <div
                className="p-4 my-4 border border-green-300 bg-green-100 text-green-700 px-4 py-3 rounded-md relative"
                role="alert"
              >
                <strong className="font-bold">Status: </strong>
                <span className="block sm:inline">{message}</span>
              </div>
            )}
          </div>
          <div className="flex flex-wrap justify-around items-center">
            <CreateStream
              account={account}
              setMessage={setMessage}
              provider={provider}
            />
            <Details memberId={account} />
          </div>
        </div>
      )}
    </div>
  );
}
