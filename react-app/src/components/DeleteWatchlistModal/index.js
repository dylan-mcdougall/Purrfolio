import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { getUserWatchlists, removeWatchlist } from "../../store/watchlists";
import './DeleteWatchlist.css'

const DeleteWatchlistModal = ({listId}) => {
    const dispatch=useDispatch()
    const { closeModal } = useModal()

    const handleSubmission = async(e) => {
        e.preventDefault();
        await dispatch(removeWatchlist(listId))
        await dispatch(getUserWatchlists())
        closeModal()
    }

    return(
        <div className="deleteWLContaint">
            <div className="dltTxt">
                <h2>Confirm Delete</h2>
                <h4>Are you sure you want to delete your watchlist?</h4>
            </div>
            <div className="buttsContainer">
                <button className="confirmYes" onClick={(e) => handleSubmission(e)}>
                    Yes (Delete Watchlist)
                </button>


                <button className="confirmNo" onClick={closeModal}>
                    No (Keep Watchlist)
                </button>
            </div>
        </div>
    )
}
export default DeleteWatchlistModal
