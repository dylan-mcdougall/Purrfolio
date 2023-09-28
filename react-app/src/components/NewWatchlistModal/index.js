import React, { useState } from "react";
import { newUserWatchlist } from "../../store/watchlists";
import { useDispatch } from "react-redux";

const CreateNewWatchlist = () => {
    const dispatch = useDispatch()
    const [name, setName] = useState('')
    const [errors, setErrors] = useState({})

    const ButtOn = () => {
        if (name.length <= 1) return true
        return false
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({})
        let err = {}
        if (name.length < 1){
            err.name = 'Name must be longer than one charater'
            console.log(err.name)
        } else if (name.length >= 20){
            err.name = 'Name must be less than 20 characters'
            console.log(err.name)
        } else {
            console.log(name)
            const data = await dispatch(newUserWatchlist(name))
            console.log(data)
        }

    }

    return(
        <div className="newWatchlistContainer">
            <div className='nwlhead'>
                <h2>Create new Watchlist</h2>
            </div>
            <div className="nwlFormContainer">
                <form className="nwlForm" onSubmit={handleSubmit}>
                    <label className='nwlTxtInput'>
                        What Would You Like to Name Your Watchlist?
                        <input
                            className="nwlNameInput"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ex: Purrfect List"
                        />
                    </label>
                    <div className="theButton">
                        <button className="addwlButt"  type="submit">Create Watchlist</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateNewWatchlist
