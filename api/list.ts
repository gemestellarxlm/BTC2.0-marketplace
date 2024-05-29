import { IInscription } from "@/types/inscription";
import axios, { AxiosError } from "axios";

const unisat_api_key = process.env.NEXT_PUBLIC_UNISAT_API_KEY;
const backend_api_base_url = process.env.NEXT_PUBLIC_BACEEND_URL;

export const listInscription = async (inscription: IInscription) => {
    const url = `${backend_api_base_url}/api/inscription/list`;
    
    try {
        await axios.post(url, inscription)
        return true;
    } catch (error) {
        return false;
    }
}

export const unlistInscription = async (inscriptionId: string) => {
    const url = `${backend_api_base_url}/api/inscription/unlist`;
    try {
        await axios.post(url, {inscriptionId})
        return true;
    } catch (error) {
        return false;
    }
}