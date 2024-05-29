import axios from "axios";

const unisat_api_key = process.env.NEXT_PUBLIC_UNISAT_API_KEY;

export const getTokenBalanceByAddressTicker = async (
  address: string,
  ticker: string
) => {
  const url = `https://open-api-testnet.unisat.io/v1/indexer/address/${address}/brc20/${ticker}/info`;
  const config = {
    headers: {
      Authorization: `Bearer ${unisat_api_key}`,
    },
  };
  
  try {
    const res = await axios.get(url, config);
    if (res.data.msg && res.data.msg == "ok") return res.data.data.availableBalance;
    return 0;
  } catch (error) {
    console.log("Balance Error => ", error);
    return 0;
  }
};
