
##Redux React Fetch

`npm install redux-react-fetch --save`

###What is this?

It's not as complicated as it sounds. There's a bunch of promise-based middleware out there, this one simple expands on that idea. Take a look at [redux-fetch](https://www.npmjs.com/package/redux-fetch). This library is, in my opinion, easier to use and does something awesome, and that's merging. Before we get to that, here's the idea:

1. Write an action for an ajax request
2. dispatch an optimistic update, with styling merged in!
3. dispatch on success or fail, with new styling

###What's merging? Why Styles?

If you are writing a lot of promises, chances are you have been checking if requests finish, and adding in some sort of logic to show the user something is wrong. This middleware aims to make doing this a lot easier. I'm hoping more people have ideas on making this even better. My main use case for this is merging in styles and doing css transitions in between state changes.

##Example

###Include the Middleware

You can pass in your preferred fetch implementation!

~~~js
import { createStore, applyMiddleware } from 'redux'
import reduxReactFetch from 'redux-react-fetch'
import fetch from 'isomorphic-fetch'

const createWithMiddleware = applyMiddleware(
  reduxReactFetch(fetch)
)(createStore)
~~~

###Write an action

~~~js
export function updateTicket(ticketId, type, value){
  return {
    type: 'updateArticle',
    url: `http://test.com`,
    body: {
      article_id: ticketId,
      title: 'New Title'
    },
    then: 'updateTicketFinished'
  }
}
~~~

There's some things inferred here:

- If no `options` are passed in the action, it will default to the following:

~~~js
const options = {
  credentials: 'same-origin',
  method: 'post',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
}
~~~
- It is a wrapper around [isomorphic-fetch](https://github.com/matthew-andrews/isomorphic-fetch). You can pass anything according to the fetch spec.
- The body is JSON stringified for you, if it is a plain object. (If you send multipart/form-data you don't want it stringified)
- `then` is optional. The same action will be called on success if it is not set. You can set `catch` as well.
- `mergeTo` is the key to merge your object to, defaults to `body`

###Merge all the things!

Now it's the cool part. By default, a `style` object is merged into the `body` object in your action. When you set the state in your store, you don't need to do anything extra.

~~~js
case 'updateArticle':
  return state.update(action.body.article_id, () => {
    return action.body
  })
case 'updateTicketFinished':
return state.update(action.body.article_id, () => {
  return action.response.result
})
~~~

Still don't get what's cool? Behind the scenes `style` (that you can change, you'll see) was added to the result and initial body:

~~~js
import React from 'react'

export default ({title, style}) => (
  <h1 style={style}>{title}</h1>
)
~~~
When you dispatch the action to update the title, it will fade to 0.5 opacity, on response it will fade back to 1. And you didn't have to do anything! Cool right? If you don't like the defaults, here's how to change it. Pass in some stuff to the middleware when you apply it:

~~~js
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

const createWithMiddleware = applyMiddleware(
  reduxFetchMerger(fetch, {start, end, endfail})
)(createStore)
~~~

I'm fairly new to redux, so there may be some things I can improve. I also didn't document everything, hopefully I will soon!

##Example File Upload Action

~~~js
export function newComment(comment, postId, attachments){
  let body = new FormData()
  attachments.forEach((file)=> {
    body.append('attachments[]', file)
  })
  body.append('user_id', user.id)
  body.append('text', comment.text)
  if(comment.status) body.append('status_id', comment.status)

  return {
    type: 'newComment',
    url: `https://test.com`,
    body,
    comment,
    postId,
    mergeTo: 'comment',
    options: {
      credentials: 'same-origin',
      method: 'post',
    },
    then: 'updateLatestComment'
  }
~~~
