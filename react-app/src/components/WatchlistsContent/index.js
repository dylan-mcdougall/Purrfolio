import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { NavLink, Route, useParams, useHistory } from "react-router-dom";
import './WatchlistContent.css'
import OpenModalButton from "../OpenModalButton";
import DeleteWatchlistModal from "../DeleteWatchlistModal";

const WatchlistContent = (stocks) => {
 console.log(stocks)

 const history = useHistory()




    const handleClick = (ticker) => {
        history.push(`/stocks/${ticker}`)
    }

    return(
        <div className="wlContentConrainer">
            <div className="wlContentTitleBar">
                <div className="contentTitle">
                    <h2>{stocks.name}</h2>
                </div>
                <div className="DeleteWatchlist">
                <OpenModalButton
                     buttonText={"Delete List"}
                     modalComponent={<DeleteWatchlistModal listId={stocks.id}/>}
                />
                </div>
            </div>
            <div className='wlTable'>
                <table className="oui">
                    <colgroup span='10'></colgroup>
                    <tr className="no" id='wlTableHeader'>
                        <th>Name</th>
                        <th>Ticker</th>
                        <th>Price</th>
                        <th>$ Change</th>
                        <th>% Change</th>
                        <th>Open</th>
                        <th>Close</th>
                        <th>High</th>
                        <th>Low</th>
                        <th>Volume</th>
                    </tr>

                    {stocks.stocks.length > 0 ?
                        stocks.stocks.map((el) => (
                            <tr className="noBorders" onClick={() => {handleClick(el.ticker)}}>
                                <th id='wlStockName'>{el.name}</th>
                                <td>{el.ticker}</td>
                                <td>{el.price}</td>
                                <td>{`$${Math.floor((el.price - el.open) * 100)/100}`}</td>
                                <td>{`${Math.floor((((el.price - el.open)/el.open)*100)*100)/100}%`}</td>
                                <td>{el.open}</td>
                                <td>{el.close}</td>
                                <td>{el.high}</td>
                                <td>{el.low}</td>
                                <td>{el.volume}</td>
                            </tr>
                        ))
                    :<div>.... loading</div>
                    }
                </table>
            </div>
        </div>
    )
}

export default WatchlistContent
