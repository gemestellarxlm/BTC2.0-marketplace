import { IOffer } from "@/types/offer";

export const getOffersByInscriptionId = async (inscriptionId: string) => {
  const res = [
    {
      sellerAddress: "tb1ppdffzw7jl9gch5ny77kuep79fgmh7n90d2j8aysv95lrwghl795s5crggu",
      buyerAddress: "tb1ppdffzw7jl9gch5ny77kuep79fgmh7n90d2j8aysv95lrwghl795s5crggu",
      inscriptionId: "string;",
      price: 2342,
      tokenTicker: "tsnt",
    },
    {
        sellerAddress: "tb1ppdffzw7jl9gch5ny77kuep79fgmh7n90d2j8aysv95lrwghl795s5crggu",
        buyerAddress: "tb1ppdffzw7jl9gch5ny77kuep79fgmh7n90d2j8aysv95lrwghl795s5crggu",
        inscriptionId: "string;",
        price: 3564,
        tokenTicker: "tsnt",
      },
      {
        sellerAddress: "tb1ppdffzw7jl9gch5ny77kuep79fgmh7n90d2j8aysv95lrwghl795s5crggu",
        buyerAddress: "tb1ppdffzw7jl9gch5ny77kuep79fgmh7n90d2j8aysv95lrwghl795s5crggu",
        inscriptionId: "string;",
        price: 8765,
        tokenTicker: "tsnt",
      },
  ];

  return res;
};

export const requestOffer = async (inscriptionId: string, buyerAddress: string, price: number, tokenTicker: string) => {

}