import { Alert } from "@mui/material";

const Notification = ({ message, type }) => {
  if(message === null){
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
    <Alert style={{marginTop: 10, marginBottom: 10}} severity={type}>
      {message}
    </Alert>
  )
}

export default Notification