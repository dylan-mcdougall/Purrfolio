const SET_PORTFOLIO = "portfolio/SET_PORTFOLIO";

const setPortfolio = (portfolio) => ({
    type: SET_PORTFOLIO,
    payload: portfolio,
});


const initialState = { portfolio: null };

export const getPortfolio = (id) => async (dispatch) => {
    const response = await fetch(`/api/users/current/portfolio`);
    const data = await response.json();
    dispatch(setPortfolio(data));
    return data;
};


const portfolioReducer = (state = initialState, action) => {
    switch(action.type){
        case SET_PORTFOLIO: {
            const newState = {...state,
            portfolio: action.payload};
            return newState;
        }
        default:
            return state;
    }
};


export default portfolioReducer;
