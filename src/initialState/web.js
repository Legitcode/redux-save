//load store data from localstorage
export default (store, defaultState) => JSON.parse(localStorage.getItem(store) || window.__INITIAL_STATE__) || defaultState
