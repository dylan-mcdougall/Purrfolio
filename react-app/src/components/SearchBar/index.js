import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import './SearchBar.css';

function SearchBar() {
    const sessionUser = useSelector(state => state.session.user);

    
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
                        <div className="response-item-ticker-wrapper">
                            {result ? result.ticker: null} 
                        </div>
                        <div className="response-item-name-wrapper">
                            {result ? result.name : null}
                        </div>
                        </a>
                    </li>
                ))}
            </ul>
        )
    }

    
    if (!sessionUser) return null;
    
    return (
        <div className="search-wrapper">
            <div className="search-flex-wrapper">
                <div className="input-wrapper">
                    <FaSearch id="search-icon" />
                    <input className="input" type="search" placeholder="Type to search..."
                        value={inputValue} onChange={(e) => handleChange(e.target.value)
                            .then((data) => {
                                setResults(data ? data.results : [])
                            })}
                    />
                </div>
                <div className="response-wrapper">
                    {responseList ? responseList : null}
                </div>
            </div>
        </div>
    )
}

export default SearchBar;
