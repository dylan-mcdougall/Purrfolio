const SINGLESTOCK = 'stocks/singleStock'

const singleStock = (stock) => ({
    type: SINGLESTOCK,
    payload: stock,
})

const setStocks = (stocks) => ({
    type: SINGLESTOCK,
    payload: stocks,
});


export const getStock = (stockTicker) => async(dispatch) => {
    const response = await fetch(`/api/stocks/${stockTicker}`)
    if (response.ok){
        const stock = await response.json()
        dispatch(singleStock(stock))
        return stock
    }
    else {
        console.log('no good')
        return null
    }
}

const SET_ALL_STOCKS = "stocks/SET_ALL_STOCKS";

const setAllStocks = (stocks) => ({
    type: SET_ALL_STOCKS,
    payload: stocks,
});


export const getAllStocks = (id) => async (dispatch) => {
    const response = await fetch(`/api/users/current/portfolio`);
    let data = await response.json();
    data = data.portfolio
    dispatch(setAllStocks(data));
    return data;
};


export const getStocks = (id) => async (dispatch) => {
    const response = await fetch(`/api/users/current/portfolio`);
    let data = await response.json();
    data = data.portfolio
    dispatch(setStocks(data));
    return data;
};

const initialState = {
    stock: null
}

const stocksReducer = (state = initialState, action) => {
    switch (action.type){
        case SINGLESTOCK:
            return {
                ...state,
                stock: action.payload
            }
        case SET_ALL_STOCKS: {
            const newState = {...state, ...action.payload};
            return newState;
            }
        default: return state
    }
}

export default stocksReducer;
