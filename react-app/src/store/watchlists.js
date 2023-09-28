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
    console.log('listId',listId)
    console.log('stockId',stockId)
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
        console.log('ok')
        const data = response.json()
        console.log(data)
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
        console.log(data)
        dispatch(getList(data))
    }
}

export const getUserWatchlists = () => async(dispatch) => {
    console.log('start')
    const response = await fetch('/api/users/current/watchlists')
    if(response.ok){
        console.log('response is ok')
        const list = await response.json()
        console.log(list.watchlists)
        dispatch(userWatchlists(list.watchlists))
    }
}
export const updateWatchlist = (name, listId) => async(dispatch) => {
    console.log(name)
    console.log(listId.listId)
    console.log('start')
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
    console.log('start')
    console.log(name)
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
        console.log(data)
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
