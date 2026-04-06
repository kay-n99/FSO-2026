import { useNavigate } from "react-router-dom";
import loginService from "../services/login";
import blogService from "../services/blogs";
import { TextField, Button } from "@mui/material";

const UserLogin = ({ username, password, setUser, setUsername, setPassword, notify }) => {
    const navigate = useNavigate();
    const handleLogin = async (event) => {
        event.preventDefault()
    
        try {
          const user = await loginService.login({ username, password })
    
          window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
          blogService.setToken(user.token)
    
          setUser(user)
          notify(`Welcome back, ${user.name}`)
          setUsername('')
          setPassword('')
          navigate('/')
        } catch (error){
            console.error(error.message)
          notify('wrong username or password', 'error')
        }

        
        
      }
    
      

  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          <TextField
            label="Username"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
            />
         
        </div>
        <div>
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            />
     
        </div>
        <Button type="submit" variant="contained" color="primary">
          login
        </Button>
      </form>
    </div>
  );
};

export default UserLogin;