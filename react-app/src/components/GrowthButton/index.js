import React, { useEffect, useState } from "react";
import alpacaStockApi from "../../services/alpacaStock";
import './index.css'

function GrowthButton({ symbol }) {
  const api = alpacaStockApi();
  const [stockInfo, setStockInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.getStock(symbol);
        if (response.ok) {
          setStockInfo(response.data);
        } else {
          console.error("Error fetching stock data:", response.problem);
        }
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    };

    fetchData();
  }, [api, symbol]);

  return (
    <div className="growth-button">
      <h2>{symbol}</h2>
      {stockInfo && (
        <div>
          <p>Stock Info: {stockInfo}</p>
        </div>
      )}
    </div>
  );
}

export default GrowthButton;
