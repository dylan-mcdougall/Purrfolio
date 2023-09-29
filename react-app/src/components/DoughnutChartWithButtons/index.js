import React, { useEffect, useState } from "react";
import DoughnutChart from "../DoughnutChart";
import GrowthButton from "../GrowthButton";
import { useSelector, useDispatch } from "react-redux";
import "./index.css";
import { getPortfolio } from "../../store/portfolio";
import { getStocks } from "../../store/stocks";

function DoughnutChartWithButtons() {
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState({
    labels: [],
    datasets: [],
  });
  const [stockTickers, setStockTickers] = useState([]);
  const sessionUser = useSelector((state) => state.session.user);
  const sessionStocks = useSelector((state) => state.stocks.stocks);
  const sessionPortfolio = useSelector((state) => state.portfolio.portfolio);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPortfolio(sessionUser.id));
    dispatch(getStocks(sessionUser.id));
  }, [dispatch, sessionUser.id]);

  useEffect(() => {
    async function fetchStockData(stockId) {
      try {
        const res = await fetch(`/api/stocks/${stockId}`);
        if (!res.ok) {
          // Handle non-200 status codes here, e.g., log the error
          console.error(`Error fetching data for stock with ID ${stockId}: ${res.statusText}`);
          return null;
        }
        const stockData = await res.json();
        const calculated = ((stockData.price - stockData.open) / stockData.open) * 100;
        stockData.growth = calculated.toFixed(2);
        return stockData;
      } catch (error) {
        // Handle network errors or unexpected exceptions here
        console.error('An error occurred while fetching data:', error);
        return null;
      }
    }

    const uniqueTickers = [];

    if (sessionStocks) {
      Promise.all(
        sessionStocks.map(async (stock) => {
          const stockData = await fetchStockData(stock.id);
          if (stockData) {
            const stockInfo = {
              ticker: stockData.ticker,
              quantity: stock.quantity,
            };
            if (!uniqueTickers.includes(stockInfo.ticker)) {
              uniqueTickers.push(stockInfo.ticker);
            }
          }
        })
      ).then(() => {
        if (uniqueTickers.length) {
          const stockInfo = {
            labels: uniqueTickers,
            datasets: [
              {
                data: sessionStocks.map((stock) => stock.quantity),
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
          setStockTickers(uniqueTickers);
        }
      });
    }
  }, [sessionStocks, isLoaded]);

  useEffect(() => {
    if (sessionPortfolio && sessionPortfolio.portfolio && sessionPortfolio.portfolio.current_funds) {
      setPortfolioValue(sessionPortfolio.portfolio.current_funds);
    }
  }, [sessionPortfolio]);

  useEffect(() => {
    if (sessionStocks) {
      sessionStocks.sort((a, b) => a.growth - b.growth);
      const topStocks = sessionStocks.slice(0, 4);
      setStockTickers(topStocks.map((stock) => stock.ticker));
    }
  }, [sessionStocks]);

  return (
    <div className="main-page">
      {isLoaded ? (
        <div className="chart-flex">
          <div className="chart">
            <DoughnutChart chartData={data} total={portfolioValue} />
          </div>
          <div className="growth-buttons">
            {stockTickers.map((symbol, index) => (
              <GrowthButton symbol={symbol} key={`${symbol}-${index}`} />
            ))}
          </div>
          <div>
          </div>
        </div>
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  );
}

export default DoughnutChartWithButtons;
