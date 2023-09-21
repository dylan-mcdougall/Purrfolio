import apisauce from 'apisauce'

const alpacaStockApi = (baseURL = 'https://data.alpaca.markets/v2') => {
    const api = apisauce.create({
        baseURL: 'https://data.alpaca.markets/v2',
        headers: {
            'APCA-API-KEY-ID': process.env.REACT_APP_API_KEY,
            'APCA-API-SECRET-KEY': process.env.REACT_APP_SECRET_KEY
        }
    });

  const getStock = (symbol) => {
    const now = new Date();
    const end = now.toISOString();
    now.setDate(now.getDate() - 1);
    const start = now.toISOString();

    const params = {
      start,
      end,
      limit: 50,
    };
      return api.get(`/stocks/${symbol}/trades`, params)
  }

  return {
    getStock
  };
};

export default alpacaStockApi;
