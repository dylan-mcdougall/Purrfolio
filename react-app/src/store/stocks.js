const STOCK = 'stocks/singleStock'

const singleStock = (stock) => ({
    type: STOCK,
    payload: stock,
})

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
        default: return state
    }
}

export default stocksReducer
