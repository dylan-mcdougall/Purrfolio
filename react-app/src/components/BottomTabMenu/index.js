import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./index.css";

function BottomTabMenu() {
  const sessionStocks = useSelector((state) => state.stocks.stocks);
  const sessionPortfolio = useSelector((state) => state.portfolio.portfolio)
  const [isLoaded, setIsLoaded] = useState(false);
  const [stockData, setStockData] = useState([]);
  const uniqueTickers = [];

  useEffect(() => {
    async function fetchStockData(id) {
      const res = await fetch(`/api/stocks/${id}`);
      const data = await res.json();
      if (!uniqueTickers.includes(id)) {
        setStockData((prevStock) => [...prevStock, data]);
        uniqueTickers.push(id);
      }
    }
    sessionStocks.map((stock) => {
      fetchStockData(stock.stock_id);
    });

  }, [sessionStocks]);


  useEffect(() => {
    console.log(sessionPortfolio);
    setIsLoaded(true);
  }, [stockData]);

  return (
    <div>
      {isLoaded ? (
        <div className="bottom-tab-menu">
          <ul>
            <li>Portfolio</li>
            <li>Order</li>
            <li>Transactions</li>
          </ul>
          <div>
            <table>
              <thead>
                <tr>
                  <th>Asset Name</th>
                  <th>Weight</th>
                  <th>Shares</th>
                  <th>Valuation</th>
                </tr>
              </thead>
              <tbody>

              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <h2>loading...</h2>
      )}
    </div>
  );
}

export default BottomTabMenu;
