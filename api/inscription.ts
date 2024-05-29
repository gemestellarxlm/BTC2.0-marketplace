import { IInscription } from "@/types/inscription";
import axios, { AxiosError } from "axios";

const unisat_api_key = process.env.NEXT_PUBLIC_UNISAT_API_KEY;
const backend_api_base_url = process.env.NEXT_PUBLIC_BACEEND_URL;

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
        pubkey: "",
        inscriptionId: inscription.inscriptionId,
        inscriptionNumber: inscription.inscriptionNumber,
        content: inscription.content,
        price: 0,
        tokenTicker: "TSNT",
      });
    }
  }

  const listedInscriptions: IInscription[] =
    await getListedInscriptionsByAddress(address);

  listedInscriptions.forEach((inscription) => {
    for (let i = 0; i < res.length; i++) {
      if (res[i].inscriptionId == inscription.inscriptionId)
        res[i].price = inscription.price;
    }
  });

  return res;
};

export const getListedInscriptionsByAddress = async (
  address: string
): Promise<IInscription[]> => {
  const url = `${backend_api_base_url}/api/inscription/address/${address}`;

  try {
    const response = await axios.get(url);
    if (response.data.success) {
      return response.data.inscriptions;
    }
    return [];
  } catch (error) {
    console.log("Error fetching content data =>", error);
    return [];
  }
};

export const getListedInscriptions = async (): Promise<IInscription[]> => {
  return [];
};

export const getInscriptionById = async (id: string, address: string) => {

  let inscription: IInscription = {
    address: "",
    pubkey: "",
    inscriptionId: "",
    inscriptionNumber: 0,
    content: "",
    price: 0,
    tokenTicker: "",
  };

  const url = `${backend_api_base_url}/api/inscription/inscriptionid/${id}`;

  try {
    const response = await axios.get(url);
    if (response.data.success) {
      inscription =  response.data.inscription;
    }
  } catch (error: any) {
    console.log("Error fetching content error:", error.response.data.error);
  }

  console.log("Get inscription by id => ", inscription);

  if (inscription.inscriptionId === "") {
    const inscriptions = await getInscriptions(address);
    console.log("Get inscription by id => ", inscriptions);
    inscriptions.forEach((item) => {
      if (item.inscriptionId === id) inscription = item;
    })
  }

  console.log("Get inscription by id => ", inscription)
  return inscription; 
};
