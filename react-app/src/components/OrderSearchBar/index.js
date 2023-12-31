import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import './index.css';

function OrderSearchBar({ onSelectResult }) {
  const [inputValue, setInputValue] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    // Your search logic here
  }, [results])

  const fetchData = async (value) => {
    const properForm = {
        "query": value
    }
    const res = await fetch('/api/stocks/search', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(properForm)
    });
    if (res.ok) {
        const stocks = await res.json()
        return stocks
    } else {
        return null;
    }
}

  const handleChange = (value) => {
    if (value) {
      setInputValue(value)
      fetchData(value).then((data) => {
        setResults(data ? data?.results?.slice(0, 2) : [])
      })
    } else {
      setInputValue(value)
      setResults([])
    }
  }

  const handleResultClick = (ticker) => {
    onSelectResult(ticker);
    setResults([]);
    setInputValue('')
  }

  return (
    <div className="order-search-wrapper">
      <div className="order-input-wrapper">
        <div className="order-input-label">
        <p>Stock Ticker or Name: </p>
        </div>
        <FaSearch id="search-icon" />
        <input
          className="input"
          type="search"
          placeholder="Type to search..."
          value={inputValue}
          onChange={(e) => handleChange(e.target.value)}
        />
      </div>
      {results && results.length > 0 && (
        <ul className="response-list order-list">
          {results.map((result) => (
            <li
              className="response-list-item order-list"
              key={result.id}
              onClick={() => handleResultClick(result.ticker)}
            >
              <div className="response-item-ticker-wrapper">
                {result.ticker}
              </div>
              <div className="response-item-name-wrapper">
                {result.name}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default OrderSearchBar;
