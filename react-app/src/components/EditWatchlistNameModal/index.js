import React, { useState } from "react";
import { updateWatchlist } from "../../store/watchlists";
import { getUserWatchlists } from "../../store/watchlists";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import './EWNM.css'

const UpdateWatchlist = (listId) => {
    const { closeModal } = useModal()
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
        }
        if (Object.values(err).length > 0){
            setErrors(err)
        } else {
            console.log(name)
            await dispatch(updateWatchlist(name, listId))
            await dispatch(getUserWatchlists())
            .then(closeModal)
        }

    }

    return(
        <div className="editWatchlistContainer">
            <div className='ewlhead'>
                <h2>Change Watchlist Name</h2>
            </div>
            <div className="ewlFormContainer">
                <form className="ewlForm" onSubmit={handleSubmit}>
                    <label className='ewlTxtInput'>
                        What Would You Like to Name Your Watchlist?
                        <input
                            className="ewlNameInput"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ex: Purrfect List"
                        />
                        {errors.name && <div className='nameErrDiv'>{errors.name}</div>}
                    </label>
                    <div className="theEButton">
                        <button className="ewlButt" disabled={!name.length} type="submit">Update</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UpdateWatchlist
