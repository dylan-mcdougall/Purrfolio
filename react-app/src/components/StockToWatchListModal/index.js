import React, { useEffect, useState } from "react";
import { addStock, getUserWatchlists } from "../../store/watchlists";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useSelector } from "react-redux";
import './StockToWatchlist.css'

const AddStockToList = ({stockId}) => {
    const { closeModal } = useModal()
    const dispatch = useDispatch()
    // const [selectedList, setSelectedList] = useState([])
    const watchlists = useSelector((state) => state.watchlists.userWatchlists)
    const sessionUser = useSelector((state) => state.session.user)
    const [toggleState, setToggleState] = useState([])


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

    useEffect(() => {
        if(sessionUser)dispatch(getUserWatchlists())
    },[dispatch, sessionUser])

    // const handleClick = (id) => {
    //     console.log(id)
    //     setToggleState(id)
    // }
    const handleSub = async() => {
        const arr = toggleState
        arr.forEach(async(el) => {
            await dispatch(addStock(el, stockId))
        })
        await dispatch(getUserWatchlists())
        .then(closeModal)
    }

    return(
        <div className="addStockContainer">
        {(sessionUser && watchlists)
            ?<div className="idkIfIneedThis">
                <div className='addStockHead'>
                    <h2>Which watchlists would you like to add this stock to?</h2>
                </div>
                <div className="addStockContent">
                    {(watchlists && watchlists.length) ?
                    (watchlists.map((el) => (
                        <div className={checker(el.id) ? 'active-aStock': 'aStock' }
                        onClick={() => handleClick(el.id)}
                        >
                            {el.name}
                        </div>
                    )))

                    :<div>...loading</div>}
                </div>
                <div className="submitBuTT" >
                    <button onClick={() => {handleSub()}} disabled={!toggleState.length}>+ Add to Watchlist</button>
                </div>
            </div>
            : <div>...loading</div>}
        </div>
    )
}

export default AddStockToList
