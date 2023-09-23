import React, { useEffect, useState } from "react";
import DoughnutChart from "../DoughnutChart";
import GrowthButton from "../GrowthButton";
import { useSelector, useDispatch } from "react-redux";
import "./index.css";
import { getPortfolio } from "../../store/portfolio";
import { getStocks } from "../../store/stocks";

function PortfolioPage() {
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
  }, [dispatch, sessionUser.id]);

  useEffect(() => {
    dispatch(getStocks(sessionUser.id));
  }, [dispatch, sessionUser.id]);

  useEffect(() => {


    async function fetchStockTickers(stockId) {
      const res = await fetch(`/api/stocks/${stockId}`);
      const data = await res.json();
      return data;
    }

    const uniqueTickers = [];


    if (sessionStocks) {
      Promise.all(
        sessionStocks.map(async (stock) => {
          const stockTicker = await fetchStockTickers(stock.id);
          const stockData = {
            ticker: stockTicker.ticker,
            quantity: stock.quantity,
          };

          if (!uniqueTickers.includes(stockData.ticker)) {
            uniqueTickers.push(stockData.ticker);
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
  }, [sessionStocks]);


  useEffect(() => {
    if (
      sessionPortfolio &&
      sessionPortfolio.portfolio &&
      sessionPortfolio.portfolio.current_funds
    ) {
      setPortfolioValue(sessionPortfolio.portfolio.current_funds);
    }
  }, [sessionPortfolio]);


  return (
    <div className="main-page">
      {isLoaded ? (
        <div>
          <div className="chart">
            <DoughnutChart chartData={data} total={portfolioValue} />
          </div>
          <div className="growth-buttons">
            {stockTickers.map((symbol) => {
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
