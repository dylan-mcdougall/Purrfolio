import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import './SearchBar.css';

function SearchBar() {
    const [inputValue, setInputValue] = useState('');
    const [results, setResults] = useState([]);

    useEffect(() => {

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
            console.log(stocks)
            return stocks
        } else {
            console.log(res);
            return null;
        }
    }

    const handleChange = (value) => {
        if (value) {
            setInputValue(value)
            return fetchData(value)
        } else {
            setInputValue(value)
            setResults([])
            return Promise.resolve()
        }
    }
    let responseList = null;
    if (results && results.length) {
        responseList = (
            <ul className="response-list">
                {results.map((result) => (
                    <li className="response-list-item" key={result.id}>
                        <a className="response-item-link" href={`/stocks/${result.ticker}`}>
                            {result ? result.ticker: null} {result ? result.name : null}
                        </a>
                    </li>
                ))}
            </ul>
        )
    }

    return (
        <div className="search-wrapper">
            <div className="input-wrapper">
                <input className="input" type="search" placeholder="Type to search..."
                    value={inputValue} onChange={(e) => handleChange(e.target.value)
                        .then((data) => {
                            setResults(data ? data.results : [])
                        }) }
                />
                <FaSearch id="search-icon" />
            </div>
                <div className="response-wrapper">
                    {responseList ? responseList : null}
                </div>
        </div>
    )
}

export default SearchBar;
