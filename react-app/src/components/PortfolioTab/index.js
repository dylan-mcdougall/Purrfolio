import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "./index.css";

function PortfolioTab() {
  const sessionStocks = useSelector((state) => state.stocks.stocks);
  const sessionPortfolio = useSelector((state) => state.portfolio.portfolio);
  const [isLoaded, setIsLoaded] = useState(false);
  const [stockData, setStockData] = useState([]);
  const [totalValuation, setTotalValuation] = useState(0);

  useEffect(() => {
    async function fetchStockData() {
      const uniqueTickers = new Set(sessionStocks.map((stock) => stock.stock_id));
      const promises = Array.from(uniqueTickers).map(async (id) => {
        const res = await fetch(`/api/stocks/${id}`);
        return res.json();
      });

      const data = await Promise.all(promises);
      setStockData(data);
    }

    if (sessionStocks?.length > 0) {
      fetchStockData();
    }
  }, [sessionStocks]);

  useEffect(() => {
    setTotalValuation(sessionPortfolio?.portfolio?.stock_valuation);
    setIsLoaded(true);
  }, [sessionPortfolio]);

  return (
    <div>
      {isLoaded ? (
        <div className="portfolio-tab">
          <table>
            <thead>
              <tr>
                <th>Asset Name</th>
                <th>Weight</th>
                <th>Shares</th>
                <th>Valuation</th>
              </tr>
            </thead>
              {stockData.length > 0 ? (
            <tbody>

                  {stockData.map((stock) => {
                    const stockName = stock.name;
                    const portfoliostock =
                      sessionPortfolio?.portfolio?.stocks.find(
                        (x) => x.stock_id === stock.id
                      );
                    const stockQty = portfoliostock?.quantity;
                    const marketValue = stockQty * stock.price;
                    const weight = (
                      (marketValue / totalValuation) *
                      100
                    ).toFixed(2);

                    return (
                      <tr key={stock.id}>
                        <td>{stockName}</td>
                        <td>{weight}%</td>
                        <td>{stockQty}</td>
                        <td>$ {marketValue.toFixed(2)}</td>
                      </tr>
                    );
                  })}
            </tbody>

              ) : (
                <tbody></tbody>
              )}
          </table>
        </div>
      ) : (
        <h2>loading...</h2>
      )}
    </div>
  );
}

export default PortfolioTab;
