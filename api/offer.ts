import { IOffer } from "@/types/offer";
import axios, { AxiosError } from "axios";

const unisat_api_key = process.env.NEXT_PUBLIC_UNISAT_API_KEY;
const backend_api_base_url = process.env.NEXT_PUBLIC_BACEEND_URL;


export const getOffersByInscriptionId = async (inscriptionId: string) => {
  const url = `${backend_api_base_url}/api/offer/all${inscriptionId}`;
  try {
    const res = await axios.get(url);
    return res.data.offers;
  } catch (error) {
    return [];
  }
};

export const requestOffer = async (
  offer: IOffer
) => {
  const url = `${backend_api_base_url}/api/offer/add`;
  try {
    const res = await axios.post(url, offer);
    return true;
  } catch (error) {
    return false;
  }
};

export const requestPsbt = async (
  inscriptionId: string,
  brcInscriptionId: string,
  fee_brcInscriptionId: string,
  buyerPubkey: string,
  buyerAddress: string,
  sellerPubkey: string,
  sellerAddress: string
) => {
  const url = `${backend_api_base_url}/api/offer/psbt`;

  try {
    const res = await axios.post(url, {
      inscriptionId: inscriptionId,
      brcInscriptionId: brcInscriptionId,
      fee_brcInscriptionId: fee_brcInscriptionId,
      buyerPubkey: buyerPubkey,
      buyerAddress: buyerAddress,
      sellerPubkey: sellerPubkey,
      sellerAddress: sellerAddress
    });
    console.log("psbt =>", res.data.psbt);
    return res.data.psbt;
  } catch(error) {
    return "";
  }
}

export const acceptOffer = async (inscriptionId: string, psbt: string, buyerSignedPsbt: string ,signedPsbt: string) => {
  const url = `${backend_api_base_url}/api/offer/accept`;
  try {
    await axios.post(url, {
      inscriptionId: inscriptionId,
      psbt: psbt,
      buyerSignedPsbt: buyerSignedPsbt,
      signedPsbt: signedPsbt
    });
    return true;
  } catch (error) {
    return false;
  }
};

export const rejectOffer = async (id: string) => {
  const url = `${backend_api_base_url}/api/offer/remove/${id}`;
  try {
    await axios.get(url);
    return true;
  } catch (error) {
    return false;
  }
};
