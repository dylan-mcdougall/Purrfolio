import React, {useState, useEffect} from "react";
import { useSelector } from "react-redux";
import './index.css'

function PortfolioTab() {
    const sessionStocks = useSelector((state) => state.stocks.stocks);
    const sessionPortfolio = useSelector((state) => state.portfolio.portfolio)
    const [isLoaded, setIsLoaded] = useState(false);
    const [stockData, setStockData] = useState([]);
    const [totalValuation, setTotalValuation] = useState(0);
    const [display, setDisplay] = useState();
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

  function handleClick() {

  }

  useEffect(() => {
    setTotalValuation(sessionPortfolio.portfolio.stock_valuation);

    setIsLoaded(true);
  }, [stockData]);

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
              <tbody>
                {stockData.map((stock) => {
                  const stockName = stock.name;
                  const portfoliostock = sessionPortfolio.portfolio.stocks.find(x => x.stock_id === stock.id)
                  const stockQty = portfoliostock.quantity
                  const marketValue = stockQty * stock.price
                  const weight = ((marketValue / totalValuation) * 100).toFixed(2)

                  return (
                    <tr key={stock.id}>
                      <td>{stockName}</td>
                      <td>{weight}%</td>
                      <td>{stockQty}</td>
                      <td>$ {marketValue}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
      ) : (
        <h2>loading...</h2>
      )}
    </div>
  );
}

export default PortfolioTab;
