import React, { useEffect, useState } from "react";
import './index.css'

function GrowthButton({ symbol }) {
  const [stockData, setStockData] = useState(null);
  const [growth, setGrowth] = useState(null);
  const [isLoaded, setIsLoaded] = useState(null);
  const [color, setColor] = useState("green");

  useEffect(() => {
    async function fetchStockData() {
        const res = await fetch(`/api/stocks/${symbol}`);
        const data = await res.json();
        setStockData(data);
        console.log(data);
    }
    fetchStockData();
  }, [symbol]);

  useEffect(() => {
    if (stockData) {
      let calculated = ((stockData.price - stockData.open) / stockData.open) * 100;
      calculated = calculated.toFixed(2);
      const newColor = calculated > 0 ? "green" : "red";
      setGrowth(calculated);
      setColor(newColor);
      setIsLoaded(true);
    }
  }, [stockData])

  return (
    <div className="growth-button">
      {isLoaded ? (
        <div>
          <h2>Growth/Loss</h2>
          <h3>{symbol}</h3>
          <h3 className={color}>{growth}</h3>
        </div>
      ) : (
        <h2>loading...</h2>
      )}
    </div>
  );
}

export default GrowthButton;
