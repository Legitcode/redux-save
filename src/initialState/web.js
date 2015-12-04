//load store data from localstorage
export default (store, defaultState) => JSON.parse(window.__INITIAL_STATE__ || localStorage.getItem(store)) || defaultState
