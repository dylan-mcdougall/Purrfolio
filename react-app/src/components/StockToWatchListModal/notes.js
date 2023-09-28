return(
    <>
    {(sessionUser && watchlists)
        ?<div className="addStockContainer">
            <div className='addStockHead'>
                <h2>Which list would you like to add your stock to?</h2>
            </div>
            <div className="addStockContent">
                {(watchlists && watchlists.length) ?
                (watchlists.map((el) => (
                    <div className={toggleState === el.id ? 'active-aStock': 'aStock' }
                    onClick={() => handleClick(el.id)}
                    >
                        {el.name}
                    </div>
                )))

                :<div>...loading</div>}
            </div>
            <div className="submitBuTT" >
                <button onClick={() => {handleSub()}}>add 2 list</button>
            </div>
        </div>
        : <div>...loading</div>}
    </>
)
}

export default AddStockToList
