import fetch from 'isomorphic-fetch'

const start = {
  opacity: 0.5,
  transition: 'opacity .5s ease-in-out'
}

const end = {
  opacity: 1,
  transition: 'opacity .5s ease-in-out'
}

const endFail = {
  opacity: 1,
  border: 'solid red 1px',
  transition: 'opacity .5s ease-in-out'
}

const options = {
  credentials: 'same-origin',
  method: 'post',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
}

export default function reduxReactFetch(config) => {
  if(!config) config = {}

  return store => next => action => { // eslint-disable-line
    if(!action.body || !action.url) return next(action)

    function makeAction(done, response, then, failed){
      let merge = {
        style: done ? failed ? config.endFail || endFail : config.end || end : config.start || start
      }

      if(response && typeof response.result == 'object') response.result.style = merge.style
      let newAction = Object.assign({}, action, { done, failed, response, type: then ? then : action.type })
      delete newAction.options
      delete newAction.url
      delete newAction.then

      if(action.mergeTo) newAction[action.mergeTo] = Object.assign({}, newAction[action.mergeTo], merge)
      else newAction.body = Object.assign({}, newAction.body, merge)

      if(then) newAction.type = then
      if(!action.catch && failed) newAction.type = action.type || 'failed'
      return newAction
    }

    next(makeAction(false))
    let body = action.body
    if(action.body.constructor.name == 'Object') body = JSON.stringify(action.body)
    return (
      fetch(action.url, Object.assign({}, action.options || options, { body }))
      .then(response => response.json())
      .then(result => next(makeAction(true, { result }, action.then, false)))
      .catch(error => next(makeAction(true, { error }, action.catch, true)))
    )
  }
}
