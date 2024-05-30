export interface IOffer {
    inscriptionId: string;
    sellerAddress: string;
    buyerAddress: string;
    price: number;
    tokenTicker: string;
    psbt: string;
    status: number;
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