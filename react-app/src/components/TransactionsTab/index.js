import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import './index.css'
import Transaction from "../Transaction";

function TransactionTab() {
  const sessionTransactions = useSelector((state) => state.portfolio.portfolio.portfolio.transactions)
  const [transactionsWithStockData, setTransactionsWithStockData] = useState([]);
  const [stockDataCache, setStockDataCache] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchStockData = async (transaction) => {
     if (!stockDataCache[transaction.stock_id]) {
       const response = await fetch(`/api/stocks/${transaction.stock_id}`);
       const stockData = await response.json();
       return { ...transaction, stockData };
     }
     return { ...transaction, stockData: stockDataCache[transaction.stock_id] };
    };

    const transactionsCopy = [...sessionTransactions];
    Promise.all(transactionsCopy.map(fetchStockData))
     .then((transactionsWithStockData) => {
       const updatedStockDataCache = transactionsWithStockData.reduce((cache, transaction) => {
         if (!cache[transaction.stock_id]) {
           cache[transaction.stock_id] = transaction.stockData;
         }
         return cache;
       }, {});
       setStockDataCache(updatedStockDataCache);
       setTransactionsWithStockData(transactionsWithStockData);
       setIsLoaded(true)
     })
     .catch((error) => {
       console.error('Error fetching stock data:', error);
     });




   }, []);

  useEffect(() => {
   console.log(transactionsWithStockData)
  }, [transactionsWithStockData])

  return (

      <div className="transaction-table">
          {isLoaded ? (
          <table>
            <thead className="sticky-header">
                <tr>
                    <th>Transaction Type</th>
                    <th>Shares</th>
                    <th>Ticker</th>
                    <th>Date</th>
                    <th>Cost</th>
                </tr>
            </thead>
            <tbody>
                {transactionsWithStockData.map((transaction) => {
                    return <Transaction transaction={transaction} />
                })}
            </tbody>
          </table>
          ) : (
          <>
          <p>Loading...</p>
          </>)}
      </div>
  )
}

export default TransactionTab
