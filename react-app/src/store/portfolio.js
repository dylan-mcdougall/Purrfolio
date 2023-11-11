
const SET_PORTFOLIO = "portfolio/SET_PORTFOLIO";
const DELETE_PORTFOLIO = "portfolio/DELETE_PORTFOLIO";
const BUY_STOCK = "portfolio/BUY_STOCK"

const setPortfolio = (portfolio) => ({
    type: SET_PORTFOLIO,
    payload: portfolio,
});

export const removePortfolio = () => ({
    type: DELETE_PORTFOLIO
})


const initialState = { portfolio: null };

export const getPortfolio = (id) => async (dispatch) => {
    const response = await fetch(`/api/users/current/portfolio`);
    const data = await response.json();
    dispatch(setPortfolio(data));
    return data;
};

export const buyStock = (id, ticker, quantity, buy) => async (dispatch) => {
    console.log('entering store action')
    const formData = {
        id,
        ticker,
        type: "Share",
        quantity,
        buy,
        order_type: "Market"
    }

    const response = await fetch(`/api/portfolios/${id}/order/share`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })

    if (response.ok) {
        const data = await response.json()
        dispatch(getPortfolio(id))
        return data
    } else {
        const data = await response.json()
        throw new Error(data.errors)
    }
}

export const buyDollar = (id, ticker, quantity, buy) => async (dispatch) => {
    const formData = {
        id,
        ticker,
        type: "Dollar",
        quantity,
        buy,
        order_type: "Market"
    }

    const response = await fetch(`/api/portfolios/${id}/order/dollar`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })

    if (response.ok) {
        const data = await response.json()
        dispatch(getPortfolio(id))
        return data
    } else {
        const data = await response.json()
        throw new Error(data.errors)
    }
}


const portfolioReducer = (state = initialState, action) => {
    switch(action.type){
        case SET_PORTFOLIO: {
            const newState = {...state,
            portfolio: action.payload};
            return newState;
        }
        case DELETE_PORTFOLIO: {
            return {portfolio: null}
        }
        default:
            return state;
    }
};


export default portfolioReducer;
