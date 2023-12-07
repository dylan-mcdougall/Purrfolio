const WATCHLISTS = 'watchlists/userWatchlists'
const DELETE_WATCHLIST = 'watchlists/deleteWatchlist'
const SET_LIST = 'watchlists/getList'
const DELETE_STOCK = 'watchlists/deleteStock'

const userWatchlists = (userWatchlists) => ({
    type: WATCHLISTS,
    payload: userWatchlists
})
const getList = (list) => ({
    type: SET_LIST,
    payload: list
})

const deleteWatchlist = (listId) => ({
    type: DELETE_WATCHLIST,
    payload: listId
})
const deleteStock = (stockId) => ({
    type: DELETE_STOCK,
    payload: stockId
})
export const removeWatchlist = (listId) => async(dispatch) => {
    const response = await fetch(`/api/watchlists/${listId}`, {method: 'DELETE'})
    if (response.ok){
        dispatch(deleteWatchlist(listId))
    }
}
export const removeStock = (listId, stockId) => async(dispatch) => {
    const response = await fetch(`/api/watchlists/${listId}/remove-stock`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            stock_id: stockId
        })
    })
    if (response.ok){
        const data = response.json()
        dispatch(deleteStock(stockId))
    }
}
export const addStock = (listId, stockId) => async(dispatch) => {
    const response = await fetch(`/api/watchlists/${listId}/add-by-id`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            stock_id: stockId
        })
    })
    if (response.ok){
        const data = await response.json()
        dispatch(getList(data))
    }
}

export const getUserWatchlists = (page) => async(dispatch) => {
    const response = await fetch('/api/users/current/watchlists')
    if(response.ok){
        const list = await response.json()
        dispatch(userWatchlists(list.watchlists))
        return page
    }
}
export const updateWatchlist = (name, listId) => async(dispatch) => {
    const response = await fetch(`api/watchlists/${listId.listId}`,{
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name
        }),
    })
    if (response.ok){
        const data = await response.json()
        dispatch(getList(data))
    }
}
export const newUserWatchlist = (name) => async(dispatch) => {
    const response = await fetch('/api/watchlists/new', {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			name
		}),
    })
    if(response.ok) {
        const data = await response.json()
        dispatch(getList(data))
    }
}

const initialState = {
    userWatchlists: [],
    list: null
}

const watchlistsReducer = (state = initialState, action) => {
    switch (action.type){
        case WATCHLISTS:
            return {
                ...state,
                userWatchlists: action.payload
            }
        case SET_LIST:
            return {
                ...state,
                list: action.payload
            }
        default: return state
    }
}
export default watchlistsReducer
