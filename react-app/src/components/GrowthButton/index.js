import React, { useEffect, useState } from "react";
import alpacaApi from "../../services/alpaca";

function GrowthButton({ symbol }) {
  const api = alpacaApi();
  const [stockInfo, setStockInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.getStock(symbol);
        if (response.ok) {
          setStockInfo(response.data);
          console.log(response.data); // Log the data here
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
    <div>
      <h2>{symbol}</h2>
      {/* Render stockInfo data here */}
      {stockInfo && (
        <div>
          {/* Display stockInfo data as needed */}
          <p>Stock Info: {stockInfo}</p>
        </div>
      )}
    </div>
  );
}

export default GrowthButton;
