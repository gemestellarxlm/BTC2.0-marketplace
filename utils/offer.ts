import { IOffer } from "@/types/offer"
import { IOfferForTable } from "@/types/offer";

export const getOfferDataForTable = (offers: any): IOfferForTable[] => {
    const res: IOfferForTable[] = offers.map((offer: any) =>{
        return {
            key:  offer. _id,
            price: offer.price,
            token: offer.tokenTicker,
            from: offer.buyerAddress,
            status: offer.status,
        };
    });

    return res;
}