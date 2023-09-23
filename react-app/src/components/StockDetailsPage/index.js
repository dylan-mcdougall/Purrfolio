import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { NavLink, Route, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getStock } from "../../store/stocks";
import "./StockDetail.css"
import StockDetailGraph from "../StockDetailsGraph";

const StockDetails = () => {
    const dispatch = useDispatch()
    const { ticker } = useParams()
    const stock = useSelector((state) => state.stocks.stock)
    const [data2, setData2] = useState(null)

    useEffect(() => {
        const fetchData2 = async () => {

            const result2 = await fetch(`https://financialmodelingprep.com/api/v3/quote/${ticker}?apikey=${process.env.REACT_APP_FMP_API_KEY}`)
            result2.json().then(json => {
                setData2(json)
            })
        }
        fetchData2()
    },[])
    useEffect(() => {
        dispatch(getStock(ticker))
    },[dispatch, ticker])


    console.log(stock)

    console.log(stock)
    return(
        <div className="stockDetailContainer">
            {stock && data2 && (
                <div className='StockDetailsTopBar'>
                <div className="sdtb_left">
                    <p>{stock.ticker}</p>
                    <p>{stock.name}</p>
                </div>
                <div className="sdtb_right">
                    <button className="Add2List" onClick={() => {
                    return(alert("Feature Coming Soon!"))
                  }}> +Add to Watchlist </button>
                </div>
                <div className="stockDetailMiddle">
                    <div className="SDMleftdiv">
                        <StockDetailGraph />
                    </div>
                    <div className='SDMrightdiv'>
                        <div>
                            <p>Current Valuation: </p>
                            <p>{`$${stock.price}`}</p>
                        </div>
                        <div>
                            <p>% Change</p>
                            <p>{`${Math.floor((((stock.price - stock.open)/stock.open)*100)*100)/100}%`}</p>
                        </div>
                        <div>
                            <p>$ Change</p>
                            <p>{`$${Math.floor((stock.price - stock.open) * 100)/100}`}</p>
                        </div>
                    </div>
                </div>
                <div className='StockDetailBottom'>
<div className='sdb_table'>
    <table>
        <thread>
            <tr>
                <th scope='col'>Name</th>
                <th scope='col'>Price</th>
                <th scope='col'>$ Change</th>
                <th scope='col'>% Change</th>
                <th scope='col'>Open</th>
                <th scope='col'>Previous Close</th>
                <th scope='col'>High</th>
                <th scope='col'>Low</th>
                <th scope='col'>Average Volume</th>
            </tr>
        </thread>
        <tbody>
            <th scope='row'>{stock.ticker}</th>
            <td>$ {stock.price}</td>
            <td>$ {`$${Math.floor((stock.price - stock.open) * 100)/100}`}</td>
            <td>% {`${Math.floor((((stock.price - stock.open)/stock.open)*100)*100)/100}%`}</td>
            <td>{stock.open}</td>
            <td>{stock.close}</td>
            <td>{data2[0].dayHigh}</td>
            <td>{data2[0].dayLow}</td>
            <td>{stock.volume}</td>
        </tbody>
    </table>
</div>
</div>

        </div>)}
        </div>
    )
}

export default StockDetails
