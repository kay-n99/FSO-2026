import { Alert } from "@mui/material";
import { useNotificationValue } from '../NotificationContext'

const Notification = () => {
  const notification = useNotificationValue()

  if(!notification || !notification.message) {
    return null
  }

  // const notificationStyle = {
  //   color: type === 'error' ? 'red' : 'green',
  //   background: 'lightgrey',
  //   fontSize: 20,
  //   borderStyle: 'solid',
  //   borderRadius: 5,
  //   padding: 10,
  //   marginBottom: 10
  // }

  return (
      <Alert severity={notification.type === 'error' ? 'error' : 'success'}>
      {notification.message}
    </Alert>
  )
}

export default Notification