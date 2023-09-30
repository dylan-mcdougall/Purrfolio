import React, { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import './SearchBar.css';

function SearchBar() {
    const sessionUser = useSelector(state => state.session.user);
    const inputRef = useRef(null);
    const searchWrapperRef = useRef(null);
    const [inputValue, setInputValue] = useState('');
    const [results, setResults] = useState([]);

    
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
            return fetchData(value)
        } else {
            setInputValue(value)
            setResults([])
            return Promise.resolve()
        }
    }

    useEffect(() => {
        function handleClickRef(e) {
            if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target)) {
                setResults([]);
            }
            if (inputRef.current && inputRef.current.contains(e.target)) {
                handleChange(inputValue).then((data) => {
                    setResults(data ? data.results : []);
                });
            }
        }

        document.addEventListener("mousedown", handleClickRef);

        return () => {
            document.removeEventListener("mousedown", handleClickRef);
        }
    }, [inputValue, results]);

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
                    <input className="input" type="search" ref={inputRef} placeholder="Type to search..."
                        value={inputValue} onChange={(e) => handleChange(e.target.value)
                            .then((data) => {
                                setResults(data ? data.results : [])
                            })}
                    />
                </div>
                <div className="response-wrapper" ref={searchWrapperRef}>
                    {responseList ? responseList : null}
                </div>
            </div>
        </div>
    )
}

export default SearchBar;
