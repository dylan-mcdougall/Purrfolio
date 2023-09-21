import React, { createContext, useEffect, useState } from "react";
import alpacaApi from "../../services/alpaca";
import DoughnutChart from "../DoughnutChart";
import GrowthButton from "../GrowthButton";
import { useSelector } from "react-redux";
import './index.css'

function PortfolioPage() {
  const [buyingPower, setBuyingPower] = useState(0);
  const [cash, setCash] = useState(0);
  const [equity, setEquity] = useState(0);
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [longMarketValue, setLongMarketValue] = useState(0);
  const [totalStocks, setTotalStocks] = useState(0);
  const [stocks, setStocks] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState(null);
  const sessionUser = useSelector((state) => state.session.user);

  console.log(sessionUser)

  useEffect(() => {

    const api = alpacaApi();
    const fetchData = async () => {
      try {
        const accountResponse = await api.getAccount();
        if (accountResponse.ok) {
          setBuyingPower(accountResponse.data.buying_power);
          setLongMarketValue(accountResponse.data.long_market_value);
          setCash(accountResponse.data.cash);
          setEquity(accountResponse.data.equity);
          setPortfolioValue(accountResponse.data.portfolio_value);
        }

        const positionsResponse = await api.getPositions();
        if (positionsResponse.ok) {
          setStocks(positionsResponse.data);
          let totalStock = 0;
          for (let i = 0; i < positionsResponse.data.length; i++) {
            totalStock += positionsResponse.data[i].qty;
          }
          setTotalStocks(totalStock);

          const stockInfo = {
            labels: positionsResponse.data.map((position) => position.symbol),
            datasets: [
              {
                label: "Total Stocks",
                data: positionsResponse.data.map((position) => position.qty),
                backgroundColor: [
                  "#0074D9",
                  "#FF4136",
                  "#2ECC40",
                  "#FF851B",
                  "#7FDBFF",
                  "#B10DC9",
                  "#FFDC00",
                  "#001f3f",
                  "#39CCCC",
                  "#01FF70",
                  "#85144b",
                  "#F012BE",
                  "#3D9970",
                  "#111111",
                  "#AAAAAA",
                ],
                borderColor: "black",
                borderWidth: 2,
              },
            ],
          };

          setData(stockInfo);
          setIsLoaded(true);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  let stockSymbols = stocks.map((stock) => stock.symbol)

  return (
    <div className="main-page">
      {isLoaded ? (
        <div>
          <div className="chart">
        <DoughnutChart chartData={data} total={portfolioValue} cash={cash} />
        </div>
        <div className="growth-buttons">
        {stockSymbols.map((symbol) => {
            return <GrowthButton symbol={symbol} key={symbol} />;
          })}
          </div>
        </div>
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  );
}

export default PortfolioPage;
