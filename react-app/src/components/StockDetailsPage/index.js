import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { NavLink, Route, useParams, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getStock } from "../../store/stocks";
import "./StockDetail.css"
import StockDetailGraph from "../StockDetailsGraph";
import { getPortfolio } from "../../store/portfolio";
import AddStockToList from "../StockToWatchListModal";
import OpenModalButton from "../OpenModalButton";

const StockDetails = () => {
    const navigate = useHistory()
    const dispatch = useDispatch()
    const { ticker } = useParams()
    const stock = useSelector((state) => state.stocks.stock)
    const portfolio = useSelector((state) => state.portfolio.portfolio)
    const [data2, setData2] = useState(null)
    const sessionUser = useSelector((state) => state.session.user);
    const [quantity1, setQuantity1]= useState(0)


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
    useEffect(() => {
        dispatch(getPortfolio(sessionUser.id))
    }, [dispatch, sessionUser])


        const PostionChecker = () => {
            const pStocks = portfolio.portfolio
            let quantity = 0

            if(pStocks.stocks.length){
                pStocks.stocks.forEach(el => {
                    if(el.stock_id === stock.id){

                        quantity = el.quantity
                    }
                });
            }

            return (
                <>{quantity}</>
            )

        }

    return(
        <div>
            {portfolio && stock && data2 && (
                <div className='stockDetailsContainer'>
                <div className="StockDetailsTopBar">
                    <div className="sdtb_left">
                                    <p>{stock.ticker}</p>
                                    <p>{stock.name}</p>
                    </div>
                    <div className="sdtb_right">
                        <OpenModalButton
                            buttonText={'Add to Watchlist'}
                            modalComponent={<AddStockToList stockId={stock.id} />}
                        />
                    </div>
                </div>
                <div className="stockDetailMiddle">
                    <div className="SDMleftdiv">
                        <div className="graph4Stock">
                                        <StockDetailGraph />
                        </div>
                    </div>
                    <div className="SDMrightDiv">
                        <div className="sdmDiv">
                            <p>Shares Owned</p>
                            <PostionChecker />


                        </div>
                        <div className="sdmDiv">
                            <p>Current Valuation: </p>
                            <p>{`$${stock.price}`}</p>
                        </div>
                        <div className="sdmDiv">
                            <p>% Change</p>
                            <p>{`${Math.floor((((stock.price - stock.open)/stock.open)*100)*100)/100}%`}</p>
                        </div>
                        <div className="sdmDiv">
                            <p>$ Change</p>
                            <p>{`$${Math.floor((stock.price - stock.open) * 100)/100}`}</p>
                        </div>
                    </div>
                </div>
                <div className="StockDetailBottom">
                    <div className="sdbTable">
                        <div className="tableBar">
                        <table>

                                <tr className="no">
                                    <th scope='col' id='fixRad'>Name</th>
                                    <th scope='col' id='woah'>Price</th>
                                    <th scope='col' >$ Change</th>
                                    <th scope='col' id='woah'>% Change</th>
                                    <th scope='col' >Open</th>
                                    <th scope='col' id='woah'>Previous Close</th>
                                    <th scope='col' >High</th>
                                    <th scope='col' id='woah'>Low</th>
                                    <th scope='col' id='noBord'  >Average Volume</th>
                                </tr>

                                <tr className="no">
                                <td>{stock.ticker}</td>
                                <td id='woah'>$ {stock.price}</td>
                                <td> {`$${Math.floor((stock.price - stock.open) * 100)/100}`}</td>
                                <td id='woah'> {`${Math.floor((((stock.price - stock.open)/stock.open)*100)*100)/100}%`}</td>
                                <td>{stock.open}</td>
                                <td id='woah'>{stock.close}</td>
                                <td>{data2[0].dayHigh}</td>
                                <td id='woah'>{data2[0].dayLow}</td>
                                <td id='noBord'>{stock.volume}</td>
                                </tr>

                        </table>
                        </div>
                    </div>
                </div>
            </div>
            )}
        </div>
    )}

export default StockDetails
