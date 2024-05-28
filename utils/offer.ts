import { IOffer } from "@/types/offer"
import { IOfferForTable } from "@/types/offer";

export const getOfferDataForTable = (offers: IOffer[]): IOfferForTable[] => {
    const res: IOfferForTable[] = offers.map((offer) =>{
        return {
            key:  offer.inscriptionId,
            price: offer.price,
            token: offer.tokenTicker,
            from: offer.buyerAddress
        };
    });

    return res;
}