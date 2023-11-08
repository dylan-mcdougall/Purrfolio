import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { NavLink, Route, useParams, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import './WatchlistBar.css'
import { getUserWatchlists } from "../../store/watchlists";
import BarContent from "../BarContent";

const WatchlistsBar = () => {
    const dispatch = useDispatch()
    const sessionUser = useSelector((state) => state.session.user)
    const watchlists = useSelector((state) => state.watchlists.userWatchlists)
    const [toggleState,setToggleState] = useState([])

    useEffect(() => {
        if(sessionUser)dispatch(getUserWatchlists())
    },[dispatch, sessionUser])


    console.log(watchlists)

    const checker = (listId) => {
        console.log(toggleState)
        let arr = toggleState
        if (arr.length){
            for (let i = 0; i < arr.length; i++){
                let el = arr[i]
                if (listId === el){

                    return true
                }
            }
        }

        return false
    }

    const makeNew = (arr, num) => {
        let newArr = []
        for (let i = 0; i < arr.length; i++){
            let el = arr[i]
             if(el !== num){
                newArr.push(el)
             }
        }
        return newArr
    }

    const handleClick = (listId) => {
        if(!toggleState.length){
            setToggleState([listId])
        }else if (checker(listId)){
            const newArr = toggleState
            console.log(newArr)
            const slicedArr = makeNew(newArr, listId)

            console.log(newArr, slicedArr)
            setToggleState(slicedArr)
        } else if (!checker(listId)){
            const newArr = [...toggleState]
            console.log(newArr)
            newArr.push(listId)
            setToggleState(newArr)
        }
    }

    return(
    <>
        {(sessionUser && watchlists)?
            <div className="WatchlistsBarContainer">
                <div className="wlbMenuSelect">
                    <div className="wlBarTitle">Watchlists</div>

                    {watchlists ? (
                        watchlists.map((el) => (
                            <>
                            <div
                                className={checker(el.id) ? "Dactive-tabs" : "Dtabs"}
                                onClick={() => handleClick(el.id)}
                            >
                                <div className="dropName">{el.name}</div>
                                <div className="upDown">
                                    <div className={!checker(el.id) ? "activeDrop" : "drop"}><i class="fa-solid fa-chevron-down"></i></div>
                                    <div className={checker(el.id) ? "activeUp" : "up"}><i class="fa-solid fa-chevron-up"></i></div>
                                </div>
                            </div>

                            <div className={checker(el.id) ? "Dactive-content" : "Dcontent"}>
                                <BarContent stocks={el.stocks}/>
                            </div>
                            </>
                        ))
                    ): <div>...loading</div>}
                </div>
            </div>

        : <div>...loading</div>}
    </>
 )
}

export default WatchlistsBar
