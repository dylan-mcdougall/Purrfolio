import React, { useEffect, useState } from "react";
import DoughnutChart from "../DoughnutChart";
import GrowthButton from "../GrowthButton";
import { useSelector, useDispatch } from "react-redux";
import "./index.css";

import { getPortfolio } from "../../store/portfolio";
import { getAllStocks } from "../../store/stocks";
import BottomTabMenu from "../BottomTabMenu";
import { useHistory } from "react-router-dom";
import WatchlistsBar from "../WatchlistsBar";

function PortfolioPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [stockTickers, setStockTickers] = useState([]);
  const [emptyPortfolio, setEmptyPortfolio] = useState(true);
  const [data, setData] = useState(null);
  const [stockData, setStockData] = useState([]);
  const sessionUser = useSelector((state) => state.session.user);
  const sessionStocks = useSelector((state) => state.stocks.stocks);
  const sessionPortfolio = useSelector((state) => state.portfolio.portfolio);
  const [topFour, setTopFour] = useState([]);
  const [fetchComplete, setFetchComplete] = useState(false);
  const dispatch = useDispatch();

  const history = useHistory();

  useEffect(() => {
    if (!sessionUser) {
      history.push("/");
      return;
    }

    async function fetchData() {
      try {
        await dispatch(getPortfolio(sessionUser.id));
        await dispatch(getAllStocks(sessionUser.id));
        setIsLoaded(true);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();

    return () => {
      setData(null);
      setEmptyPortfolio(true);
      setIsLoaded(false);
      setStockTickers([]);
      setPortfolioValue(0);
      setStockData([]);
      setTopFour([]);
      setFetchComplete(false);
    };
  }, [dispatch, sessionUser, history]);

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
            font: {
              size: 14,
              family: "Poppins",
            },
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
          setEmptyPortfolio(false);
        }
      });
    } else {
      setEmptyPortfolio(true);
    }
  }, [sessionPortfolio, sessionStocks, sessionUser, dispatch]);

  useEffect(() => {
    async function fetchStockData(id) {
      const res = await fetch(`/api/stocks/${id}`);
      const data = await res.json();
      return data;
    }

    Promise.all(stockTickers.map(fetchStockData))
      .then((fetchedData) => {
        setStockData(fetchedData);
        setFetchComplete(true);
      })
      .catch((error) => {
        console.error("Error fetching stock data:", error);
      });
  }, [stockTickers]);

  useEffect(() => {
    if (fetchComplete) {
      const stocksWithGrowth = stockData.map((stock) => {
        let growth = (((stock.price - stock.open) / stock.open) * 100).toFixed(
          2
        );
        return {
          ...stock,
          growthAbsolute: Math.abs(parseFloat(growth)),
          growth: growth,
        };
      });
      const sortedStocks = stocksWithGrowth
        .sort((a, b) => b.growthAbsolute - a.growthAbsolute)
        .slice(0, 4);
      setTopFour(sortedStocks);
    }
  }, [fetchComplete, stockData]);

  useEffect(() => {
    if (sessionPortfolio && sessionPortfolio.portfolio) {
      setPortfolioValue(
        sessionPortfolio?.portfolio?.current_funds || "Loading..."
      );
    }

    if (
      !sessionPortfolio ||
      !sessionPortfolio.portfolio ||
      !sessionPortfolio.portfolio.stocks
    ) {
      setEmptyPortfolio(true);
    }
  }, [sessionPortfolio]);

  return (
    <div className="body-wrapper">
      <div className="main-page-wrapper">
        <div className="main-page">
          {emptyPortfolio ? (
            <div className="empty-portfolio">
              <img src="assets/sad_cat.png" alt="sad cat" />
              <h2>Please add funds and order stocks to get started.</h2>
            </div>
          ) : (
            <div>
              {isLoaded ? (
                <div className="chart-wrapper">
                  {data ? (
                    <>
                      <div className="chart">
                        <DoughnutChart chartData={data} total={sessionPortfolio?.portfolio?.total_valuation} />
                      </div>
                      <div className="growth-buttons">
                        {topFour.map((stock) => {
                          return (
                            <GrowthButton
                              growth={stock.growth}
                              symbol={stock.ticker}
                              key={stock.id}
                            />
                          );
                        })}
                      </div>
                      <div></div>
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
        <WatchlistsBar />
        {isLoaded && sessionPortfolio ? (
          <BottomTabMenu display={"portfolio"} />
        ) : (
          <BottomTabMenu display={"order"} />
        )}
      </div>
    </div>
  );
}

export default PortfolioPage;
