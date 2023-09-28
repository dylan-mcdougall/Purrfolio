import React, { useEffect, useState } from "react";
import DoughnutChart from "../DoughnutChart";
import GrowthButton from "../GrowthButton";
import { useSelector, useDispatch } from "react-redux";
import "./index.css";

import { getPortfolio } from "../../store/portfolio";
import { getAllStocks } from "../../store/stocks";
import BottomTabMenu from "../BottomTabMenu";
import { useHistory } from 'react-router-dom';

function PortfolioPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [stockTickers, setStockTickers] = useState([]);
  const [emptyPortfolio, setEmptyPortfolio] = useState(true);
  const [data, setData] = useState(null);
  const sessionUser = useSelector((state) => state.session.user);
  const sessionStocks = useSelector((state) => state.stocks.stocks);
  const sessionPortfolio = useSelector((state) => state.portfolio.portfolio);
  const dispatch = useDispatch();

  const history = useHistory();

  useEffect(() => {
    if (sessionUser && sessionUser.id && !isLoaded) {
      async function fetchData() {
        await dispatch(getPortfolio(sessionUser.id));
        await dispatch(getAllStocks(sessionUser.id));
        setIsLoaded(true); // Set isLoaded to true after fetching data.
      }

      fetchData();
    }
  }, [dispatch, sessionUser, isLoaded]);

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
          const stockTicker = await fetchStockTickers(stock.stock_id);
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
    } else {
      setEmptyPortfolio(true);
    }
  }, [sessionStocks, sessionPortfolio, isLoaded, data]);

  useEffect(() => {
    if (sessionPortfolio && sessionPortfolio.portfolio) {
      setPortfolioValue(sessionPortfolio.portfolio.current_funds);
    }

    if (
      !sessionPortfolio ||
      !sessionPortfolio.portfolio ||
      !sessionPortfolio.portfolio.stocks
    ) {
      setEmptyPortfolio(false);
    }
  }, [sessionPortfolio]);

  if (!sessionUser) {
    history.push('/');
    return null;
  }

  return (
    <div className="main-page">
      {emptyPortfolio || !data ? (
        <div className="empty-portfolio">
          <img src="assets/sad_cat.png" alt="sad cat"/>
          <h2>Please add funds and order stocks to get started.</h2>
          <BottomTabMenu display={"order"}/>
        </div>
      ) : (
        <div>
          {isLoaded ? (
            <div>
              {data ? (
                <>
                  <div className="chart">
                    <DoughnutChart chartData={data} total={portfolioValue} />
                  </div>
                  <div className="growth-buttons">
                    {stockTickers.map((symbol) => {
                      return <GrowthButton symbol={symbol} key={symbol} />;
                    })}
                  </div>
                  <div>
                    <BottomTabMenu display={"portfolio"}/>
                  </div>
                </>
              ) : (
                <p>No data available.</p>
              )}
            </div>
          ) : (
            <h1>Loading...</h1>
          )}
        </div>
      )}
    </div>
  );
}

export default PortfolioPage;
