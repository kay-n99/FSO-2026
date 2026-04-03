import { createContext, useReducer } from 'react'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return action.payload
    case 'CLEAR':
      return null
    default:
      return state
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
    const [notification, notificationDispatch] = useReducer(notificationReducer, null)

    const setNotification = (message, time) => {
        notificationDispatch({
            type: 'SET',
            payload: message
        })
        setTimeout(() =>{
            notificationDispatch({
                type: 'CLEAR'
            })
        }, time * 1000)
    }

    return (
        <NotificationContext.Provider value={{notification, notificationDispatch, setNotification}}>
            {props.children}
        </NotificationContext.Provider>
    )
}

export default NotificationContext