
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPortfolio } from "../../store/portfolio";
import { useModal } from "../../context/Modal";


function AddFundsModal() {
    const [amount, setAmount] = useState(0);
    const sessionPortfolio = useSelector((state) => state.portfolio.portfolio);
    const sessionUser = useSelector((state) => state.session.user);
    const [currentFunds, setCurrentFunds] = useState(0);
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    useEffect(() => {
        setCurrentFunds(sessionPortfolio.portfolio.current_funds)
    }, [sessionPortfolio])

    async function handleClick(e) {
        e.preventDefault()
        const portfolioId = sessionPortfolio.portfolio.id
        const formData = {
            funds: amount
        }
        await fetch(`/api/portfolios/${portfolioId}/add-funds`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
              },
            body: JSON.stringify(formData)
        })
        dispatch(getPortfolio(sessionUser.id));
        closeModal();
    }

    return (
        <div>
            <div>
                <h3>Add Funds to your Purrfolio</h3>
            </div>
            <div>
                <p>Current Funds: {currentFunds.toFixed(2)}</p>
                <form>
                    <label htmlFor="amount">Desired Amount: </label>
                    <input type="number" name="amount" min="0" defaultValue={amount} onChange={(e) => setAmount(e.target.value)}></input>
                    <p>* This is paper money, no real trades will be executed.</p>
                    <button onClick={(e) => handleClick(e)}>Confirm</button>
                </form>
            </div>
        </div>
    )
}

export default AddFundsModal;
