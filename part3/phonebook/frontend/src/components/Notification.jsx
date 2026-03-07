const Notification = ({ message, isError}) => {
    if(message === null){
        return null
    }

    return (
        <>
        {message == "" ? (
            <div>
            </div>
      ) : (
        <div className={isError ? 'error' : 'success'} >
            {message}
        </div>
      )}
        
        </>
    )
}

export default Notification