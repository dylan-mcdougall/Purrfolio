const SET_STOCKS = "stocks/SET_STOCKS";

const setStocks = (stocks) => ({
    type: SET_STOCKS,
    payload: stocks,
});

const initialState = { stocks: null }

export const getStocks = (id) => async (dispatch) => {
    const response = await fetch(`/api/portfolios/${id}/stocks`);
    const data = await response.json();
    dispatch(setStocks(data));
    return data;
};

const stockReducer = (state = initialState, action) => {
    switch(action.type){
        case SET_STOCKS: {
            const newState = {...state, ...action.payload};
            return newState;
        }
        default:
            return state;
    }
};

export default stockReducer;
