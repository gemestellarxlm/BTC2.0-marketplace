export interface IOffer {
    _id: string;
    inscriptionId: string;
    sellerAddress: string;
    buyerAddress: string;
    price: number;
    tokenTicker: string;
    psbt: string;
    status: number;
    buyerSignedPsbt: string;
}

export interface IOfferForTable {
    key: string;
    price: number;
    token: string;
    from: string;
    status: number;
}

export interface IOfferForTableMe {
    key: string;
    price: number;
    token: string;
    from: string;
    action: string;
}