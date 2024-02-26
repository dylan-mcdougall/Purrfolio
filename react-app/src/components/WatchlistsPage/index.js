import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { NavLink, Route, useParams, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import './WatchlistsPage.css'
import { getUserWatchlists } from "../../store/watchlists";
import WatchlistContent from "../WatchlistsContent";
import OpenModalButton from "../OpenModalButton";
import CreateNewWatchlist from "../NewWatchlistModal";


const WatchlistsPage = () => {
    const history = useHistory()
    const dispatch = useDispatch()
    const sessionUser = useSelector((state) => state.session.user)
    const watchlists = useSelector((state) => state.watchlists.userWatchlists)
    const fWatch = useSelector((state) => state.watchlists.userWatchlists)

    useEffect(() => {
        if(sessionUser)dispatch(getUserWatchlists())
        else return history.push('/')
    },[dispatch, sessionUser])

    const [toggleState, setToggleState] =useState(1)
    const toggleTab = (index) => {
        setToggleState(index)
    }
    useEffect(() => {
        if (watchlists.length){
            setToggleState(watchlists[0].id)
        }
    }, [watchlists, setToggleState])

    return(
        <div className="body-wrapper">

        {(sessionUser && watchlists.length)
        ?

            <div className='WatchlistContainer'>

             <div className="wlTopBar">
                <div className="wltbTabs">
                    {watchlists ? (
                        watchlists.map((el) => (
                            <div
                            className={toggleState === el.id ? "tabs active-tabs" : "tabs"}
                            onClick={() => toggleTab(el.id)}
                            >{el.name}</div>
                        ))
                    ): <div>...loading</div>}
                </div>
                <div className="wltbAddList">
                    <div className='addWatchlist'>
                    <OpenModalButton
                     buttonText={<i class="fa-regular fa-square-plus"></i>}
                     modalComponent={<CreateNewWatchlist />}
                    />
                    </div>
                </div>


             </div>
             <div className="wlContent">
                {watchlists ? (
                 watchlists.map((el) => (
                     <div
                     className={toggleState === el.id ? "content active-content" : "content"}
                     key={el.id}
                     >
                        <WatchlistContent stocks={el.stocks} name={el.name} id={el.id}  />
                     </div>
                 ))
                ): <div>...loading</div>}
             </div>



        </div> : <div className="noListBack">

        <div className="noListAdd">
            <div className="noListHeader">
                Create a Watchlist!
            </div>
             <div className='addWatchlist'>
                    <OpenModalButton
                     buttonText={<i class="fa-regular fa-square-plus"></i>}
                     modalComponent={<CreateNewWatchlist />}
                    />
             </div>
            </div>
        </div>}
        </div>

    )
}

export default WatchlistsPage
