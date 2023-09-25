const STOCK = 'stocks/singleStock';
const SET_STOCKS = "stocks/SET_STOCKS";

const singleStock = (stock) => ({
    type: STOCK,
    payload: stock,
})

const setStocks = (stocks) => ({
    type: SET_STOCKS,
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
        case STOCK:
            return {
                ...state,
                stock: action.payload
            }
        case SET_STOCKS: {
            const newState = {...state, ...action.payload};
            return newState;
            }
        default: return state
    }
}

export default stocksReducer
