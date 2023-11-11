import React, {useState, useEffect} from "react";
import { useHistory } from "react-router-dom";
import './index.css'

function Transaction({transaction}) {
    const dateObject = new Date(transaction.created_at)
    const year = dateObject.getFullYear();
    const month = ("0" + (dateObject.getMonth() + 1)).slice(-2);
    const day = ("0" + dateObject.getDate()).slice(-2);
    const formattedDate = `${month}-${day}-${year}`;
    const history = useHistory();

    const handleClick = () => {
        history.push(`/stocks/${transaction.stockData.ticker}`)
    }


    return (
        <tr className="transaction-row" onClick={() => handleClick()}>
            {transaction.buy ? (<td className="transaction-buy">Buy</td>) : (<td className="transaction-sell">Sell</td>)}
            <td>{transaction.quantity.toFixed(2)}</td>
            <td>{transaction.stockData.ticker}</td>
            <td>{formattedDate}</td>
            <td>{transaction.price.toFixed(2)}</td>
        </tr>
    )
}

export default Transaction;
