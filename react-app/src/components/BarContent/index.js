import './BarContent.css'

const BarContent = (stocks) => {


    return(
        <>
            {stocks.stocks.length > 0 ?
            stocks.stocks.map((el) => (
                <div className='wlBarContent'>
                    <div className='barTicker'>{el.ticker}</div>
                    <div className='barChange'>{`${Math.floor((((el.price - el.open)/el.open)*100)*100)/100}%`}</div>
                    <div className='barPrice'>{el.price}</div>
                </div>
            ))
            :<div className='noStockInList'>No Stocks in Watchlist</div>}
        </>
    )
}

export default BarContent
