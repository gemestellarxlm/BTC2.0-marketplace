import { type Network } from "bitcoinjs-lib";
import { testnet } from "bitcoinjs-lib/src/networks";
import { IInscription } from "@/types/inscription";


export const getInscriptions = async (
  address: string,
  network: Network
): Promise<IInscription[]> => {
  const basePath = network === testnet ? "testnet/" : "";
  const url = `/${basePath}wallet-api-v4/address/inscriptions?address=${address}&cursor=0&size=100`;
  console.log("Requesting URL:", url); // Log the URL being requested

  const res = await fetch(url);
  const text = await res.text(); // First get the response as text to check what's coming back
  console.log("Server response:", text); // Log the raw response text

  try {
    const inscriptionDatas = JSON.parse(text); // Try to parse the text as JSON
    const inscriptions: IInscription[] = [];
    inscriptionDatas.result.list.forEach((inscriptionData: any) => {
      inscriptions.push({
        address: inscriptionData.address,
        inscriptionId: inscriptionData.inscriptionId,
        inscriptionNumber: inscriptionData.inscriptionNumber,
        output: inscriptionData.output,
        outputValue: inscriptionData.outputValue,
        content: inscriptionData.content,
        price: 0,
        tokenTicker: "",
      });
    });

    return inscriptions;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    throw error; // Rethrow to handle it in the component if needed
  }
};

export const getListedInscriptions = async () => {
  const testData = [
    {
      address: "string1",
      inscriptionId: "string",
      inscriptionNumber: 398433,
      output: "string",
      outputValue: 87987,
      content:
        "https://static-testnet.unisat.io/content/1bfcfc75338cb542d7f8d265d0d3a82abe7797f9328c5504a50c60b241c8bb88i0",
      price: 987987,
      tokenTicker: "TSNT",
    },
    {
      address: "string2",
      inscriptionId: "string",
      inscriptionNumber: 398433,
      output: "string",
      outputValue: 87987,
      content:
        "https://static-testnet.unisat.io/content/1bfcfc75338cb542d7f8d265d0d3a82abe7797f9328c5504a50c60b241c8bb88i0",
      price: 987987,
      tokenTicker: "TSNT",
    },
    {
      address: "string3",
      inscriptionId: "string",
      inscriptionNumber: 398433,
      output: "string",
      outputValue: 87987,
      content:
        "https://static-testnet.unisat.io/content/1bfcfc75338cb542d7f8d265d0d3a82abe7797f9328c5504a50c60b241c8bb88i0",
      price: 987987,
      tokenTicker: "TSNT",
    },
    {
      address: "string4",
      inscriptionId: "string",
      inscriptionNumber: 398433,
      output: "string",
      outputValue: 87987,
      content:
        "https://static-testnet.unisat.io/content/1bfcfc75338cb542d7f8d265d0d3a82abe7797f9328c5504a50c60b241c8bb88i0",
      price: 987987,
      tokenTicker: "TSNT",
    },
  ];

  return testData;
};

export const getInscriptionById = async (id: string) => {
  const inscription = {
    address: "string1",
    inscriptionId: "string",
    inscriptionNumber: 398433,
    output: "string",
    outputValue: 87987,
    content:
      "https://static-testnet.unisat.io/content/1bfcfc75338cb542d7f8d265d0d3a82abe7797f9328c5504a50c60b241c8bb88i0",
    price: 987987,
    tokenTicker: "TSNT",
  };
  return inscription;
};
