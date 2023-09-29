import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { NavLink, Route, useParams, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import './WatchlistContent.css'
import OpenModalButton from "../OpenModalButton";
import DeleteWatchlistModal from "../DeleteWatchlistModal";
import UpdateWatchlist from "../EditWatchlistNameModal";
import { removeStock } from "../../store/watchlists";
import { getUserWatchlists } from "../../store/watchlists";

const WatchlistContent = (stocks) => {
 const dispatch = useDispatch()
 console.log(stocks.stocks)

 const history = useHistory()


    const removeAStock = async(listId, stockId) => {
        await dispatch(removeStock(listId, stockId))
        await dispatch(getUserWatchlists())

    }

    const handleClick = (ticker) => {
        history.push(`/stocks/${ticker}`)
    }

    return(
        <div className="wlContentConrainer" >
            <div className="wlContentTitleBar">
                <div className="contentTitle">
                    <h2>{stocks.name}</h2>
                </div>
                <div className="tbRightSide">
                    <div className="editName">
                        <OpenModalButton
                            buttonText={<i class="fa-regular fa-pen-to-square"></i>}
                            modalComponent={<UpdateWatchlist listId={stocks.id} />}
                        />
                    </div>
                    <div className="DeleteWatchlist">
                        <OpenModalButton
                            buttonText={"Delete List"}
                            modalComponent={<DeleteWatchlistModal listId={stocks.id}/>}
                        />
                    </div>
                </div>
            </div>
            <div className='wlTable'>
                <table className="oui">
                    <colgroup span='11'></colgroup>
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
                        <th></th>
                    </tr>

                    {stocks.stocks.length > 0 ?
                        stocks.stocks.map((el) => (
                            <tr className="noBorders" >
                                <th id='wlStockName' onClick={() => {handleClick(el.ticker)}}>{el.name}</th>
                                <td onClick={() => {handleClick(el.ticker)}}>{el.ticker}</td>
                                <td onClick={() => {handleClick(el.ticker)}}>{el.price}</td>
                                <td onClick={() => {handleClick(el.ticker)}}>{`$${Math.floor((el.price - el.open) * 100)/100}`}</td>
                                <td onClick={() => {handleClick(el.ticker)}}>{`${Math.floor((((el.price - el.open)/el.open)*100)*100)/100}%`}</td>
                                <td onClick={() => {handleClick(el.ticker)}}>{el.open}</td>
                                <td onClick={() => {handleClick(el.ticker)}}>{el.close}</td>
                                <td onClick={() => {handleClick(el.ticker)}}>{el.high}</td>
                                <td onClick={() => {handleClick(el.ticker)}}>{el.low}</td>
                                <td onClick={() => {handleClick(el.ticker)}}>{el.volume}</td>
                                <td id='delButt'><button onClick={() => {removeAStock(stocks.id, el.id)}}>x</button></td>
                            </tr>
                        ))
                    :<tr className="plsAddStk">
                        <td align="center" colSpan={"11"}>Add stocks to Watchlist</td>
                     </tr>
                    }
                </table>
            </div>
        </div>
    )
}

export default WatchlistContent
