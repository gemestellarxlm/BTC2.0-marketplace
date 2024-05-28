import { IOffer } from "@/types/offer";

const getOffersByInscriptionId = async (inscriptionId: string) => {
  const res = [
    {
      sellerAddress: "string",
      buyerAddress: "string;",
      inscriptionId: "string;",
      price: 2342,
      tokenTicker: "tvnt",
    },
    {
        sellerAddress: "string",
        buyerAddress: "string;",
        inscriptionId: "string;",
        price: 3564,
        tokenTicker: "tvnt",
      },
      {
        sellerAddress: "string",
        buyerAddress: "string;",
        inscriptionId: "string;",
        price: 8765,
        tokenTicker: "tvnt",
      },
  ];

  return res;
};

export default getOffersByInscriptionId;