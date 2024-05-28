export interface IOffer {
    sellerAddress: string;
    buyerAddress: string;
    inscriptionId: string;
    price: number;
    tokenTicker: string;
}

export interface IOfferForTable {
    key: string;
    price: number;
    token: string;
    from: string;
}

export interface IOfferForTableMe {
    key: string;
    price: number;
    token: string;
    from: string;
    action: string;
}