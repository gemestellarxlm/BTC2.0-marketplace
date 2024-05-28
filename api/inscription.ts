import { IInscription } from "@/types/inscription";
import axios from "axios";

const unisat_api_key = process.env.NEXT_PUBLIC_UNISAT_API_KEY;

const fetchContentData = async (contentUrl: string): Promise<any> => {
  try {
    const response = await axios.get(contentUrl);
    return response.data;
  } catch (error) {
    console.error("Error fetching content data:", error);
    return null;
  }
};

export const getInscriptions = async (
  address: string
): Promise<IInscription[]> => {
  const initialResponse = await window.unisat.getInscriptions(0, 100);
  const res: IInscription[] = [];
  for (const inscription of initialResponse.list) {
    const contentData = await fetchContentData(inscription.content);
    if (contentData && !contentData.tick) {
      res.push({
        address: address,
        inscriptionId: inscription.inscriptionId,
        inscriptionNumber: inscription.inscriptionNumber,
        content: inscription.content,
        price: 0,
        tokenTicker: "TSNT",
      });
    }
  }
  const listedInscriptions: IInscription[] = await getListedInscriptionsByAddress(address);

  listedInscriptions.forEach((inscription) => {
    for (let i = 0; i < res.length; i++) {
      if (res[i].inscriptionId == inscription.inscriptionId) res[i].price = inscription.price; 
    }
  })

  return res;
};

export const getListedInscriptionsByAddress = async (address: string): Promise<IInscription[]> => {
  return [];
};

export const getListedInscriptions = async (): Promise<IInscription[]> => {
  const testData = [
    {
      address: "tb1ppdffzw7jl9gch5ny77kuep79fgmh7n90d2j8aysv95lrwghl795s5crggu",
      inscriptionId:
        "1bfcfc75338cb542d7f8d265d0d3a82abe7797f9328c5504a50c60b241c8bb88i0",
      inscriptionNumber: 398433,
      content:
        "https://static-testnet.unisat.io/content/1bfcfc75338cb542d7f8d265d0d3a82abe7797f9328c5504a50c60b241c8bb88i0",
      price: 987987,
      tokenTicker: "TSNT",
    },
    {
      address: "tb1ppdffzw7jl9gch5ny77kuep79fgmh7n90d2j8aysv95lrwghl795s5crggu",
      inscriptionId:
        "1bfcfc75338cb542d7f8d265d0d3a82abe7797f9328c5504a50c60b241c8bb88i0",
      inscriptionNumber: 398433,
      content:
        "https://static-testnet.unisat.io/content/1bfcfc75338cb542d7f8d265d0d3a82abe7797f9328c5504a50c60b241c8bb88i0",
      price: 987987,
      tokenTicker: "TSNT",
    },
    {
      address: "tb1ppdffzw7jl9gch5ny77kuep79fgmh7n90d2j8aysv95lrwghl795s5crggu",
      inscriptionId: "string",
      inscriptionNumber: 398433,
      content:
        "https://static-testnet.unisat.io/content/1bfcfc75338cb542d7f8d265d0d3a82abe7797f9328c5504a50c60b241c8bb88i0",
      price: 987987,
      tokenTicker: "TSNT",
    },
    {
      address: "tb1ppdffzw7jl9gch5ny77kuep79fgmh7n90d2j8aysv95lrwghl795s5crggu",
      inscriptionId: "string",
      inscriptionNumber: 398433,
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
    address: "tb1ppdffzw7jl9gch5ny77kuep79fgmh7n90d2j8aysv95lrwghl795s5crggu",
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
