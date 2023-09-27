return(
    <div className='WatchlistContainer'>
        <div className="wlTopBar">
            <div
            className={toggleState === 1 ? "tabs active-tabs" : "tabs"}
            onClick={() => toggleTab(1)}
            >tab1</div>
            <div className={toggleState === 2 ? "tabs active-tabs" : "tabs"}
            onClick={() => toggleTab(2)}
            >tab2</div>
            <div className={toggleState === 3 ? "tabs active-tabs" : "tabs"}
            onClick={() => toggleTab(3)}
            >tab3</div>
        </div>
        <div className="wlContent">
            <div className={toggleState === 1 ? "content active-content" : "content"}>
                <h2>hi</h2>
                <hr />
                <p>lorem ipsum</p>
            </div>
            <div className={toggleState === 2 ? "content active-content" : "content"}>
                <h2>here</h2>
                <hr />
                <p>opossum pie</p>
            </div>
            <div className={toggleState === 3 ? "content active-content" : "content"}>
                <h2>bye</h2>
                <hr />
                <p>michale angelo</p>
            </div>

        </div>
    </div>
)
