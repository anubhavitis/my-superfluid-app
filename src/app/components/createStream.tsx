import { Contract } from "ethers";
import { ethers } from "ethers";
import { BrowserProvider } from "ethers";
import React, { useState } from "react";
import { Address, encodeAbiParameters, parseAbiParameters } from "viem";
import InputBox from "./inputs";

function CreateStream({
  account,
  setMessage,
  provider,
}: {
  account: Address;
  setMessage: (message: string) => void;
  provider: BrowserProvider | null;
}) {
  const [tokenAddress, setTokenAddress] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");
  const [flowRate, setFlowRate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const CFAv1ForwarderAddress = "0xcfA132E353cB4E398080B9700609bb008eceB125";

  const CFAv1ForwarderABI = [
    "function createFlow(address token, address sender, address receiver, int96 flowRate, bytes memory userData) external returns (bool)",
  ];

  const createStream = async () => {
    if (!provider) {
      setMessage("Please connect your wallet first.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("Creating stream...");
      const signer = await provider.getSigner();
      const contract = new Contract(
        CFAv1ForwarderAddress,
        CFAv1ForwarderABI,
        signer
      );

      let passedFlowRate = ethers.parseUnits(flowRate, 18);
      let data = "0x2CeADe86A04e474F3cf9BD87208514d818010627" as Address;
      let userData = encodeAbiParameters(parseAbiParameters("address, int96"), [
        data,
        passedFlowRate,
      ]);

      const tx = await contract.createFlow(
        tokenAddress,
        account,
        receiverAddress,
        passedFlowRate,
        userData
      );
      await tx.wait();
      setMessage("The stream has been created successfully.");

      setTokenAddress("");
      setReceiverAddress("");
      setFlowRate("");
    } catch (error) {
      console.error("Error creating stream:", error);
      setError(
        error instanceof Error ? error.message : "Failed to create stream"
      );
      setMessage("Failed to create stream. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 m-2 bg-white rounded-lg shadow-lg lg: w-1/3">
      <h2 className="text-2xl font-bold mb-6">Create Stream</h2>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-500 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-4 w-full">
        <InputBox
          label="Token Address"
          placeholder="Enter token address"
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
        />

        <InputBox
          label="Receiver Address"
          placeholder="Enter receiver address"
          value={receiverAddress}
          onChange={(e) => setReceiverAddress(e.target.value)}
        />

        <InputBox
          label="Flow Rate"
          placeholder="Enter flow rate"
          value={flowRate}
          onChange={(e) => setFlowRate(e.target.value)}
        />

        <button
          onClick={createStream}
          disabled={isLoading || !tokenAddress || !receiverAddress || !flowRate}
          className={`
            w-full px-6 py-3 mt-6 rounded-lg font-medium text-white
            transition-colors duration-200
            ${
              isLoading || !tokenAddress || !receiverAddress || !flowRate
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 cursor-pointer"
            }
          `}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Creating Stream...
            </div>
          ) : (
            "Create Stream"
          )}
        </button>
      </div>
    </div>
  );
}

export default CreateStream;
