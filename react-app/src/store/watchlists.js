const WATCHLISTS = 'watchlists/userWatchlists'
const DELETE_WATCHLIST = 'watchlists/deleteWatchlist'

const userWatchlists = (userWatchlists) => ({
    type: WATCHLISTS,
    payload: userWatchlists
})

const deleteWatchlist = (listId) => ({
    type: DELETE_WATCHLIST,
    payload: listId
})
export const removeWatchlist = (listId) => async(dispatch) => {
    const response = await fetch(`/api/watchlists/${listId}`, {method: 'DELETE'})
    if (response.ok){
        dispatch(deleteWatchlist(listId))
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
        dispatch(userWatchlists(data))
    }
}

const initialState = {
    userWatchlists: []
}

const watchlistsReducer = (state = initialState, action) => {
    switch (action.type){
        case WATCHLISTS:
            return {
                ...state,
                userWatchlists: action.payload
            }
        default: return state
    }
}
export default watchlistsReducer
