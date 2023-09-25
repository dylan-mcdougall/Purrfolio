import apisauce from 'apisauce'
import config from '../config';

const alpacaApi = (baseURL = 'https://paper-api.alpaca.markets/') => {
    const api = apisauce.create({
        baseURL: 'https://paper-api.alpaca.markets/',
        headers: {
            'APCA-API-KEY-ID': process.env.REACT_APP_API_KEY,
            'APCA-API-SECRET-KEY': process.env.REACT_APP_SECRET_KEY
        }
    });

  const getAccount = () => api.get('v2/account');
  const getPositions = () => api.get('v2/positions');
  const getStock = (symbol) => {
    const now = new Date();
    const end = now.toISOString();
    now.setDate(now.getDate() - 1);
    const start = now.toISOString();

    const params = {
      start,
      end,
      limit: 1000,
    };
      return api.get(`/stocks/${symbol}/trades`, params)
  }

  return {
    getAccount,
    getPositions,
    getStock
  };
};

export default alpacaApi;
