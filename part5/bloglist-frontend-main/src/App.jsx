import { useState, useEffect } from "react";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import BlogList from "./components/BlogList";
import Blog from "./components/Blog";
import UserLogin from "./components/UserLogin";
import Notification from "./components/Notification";
import CreateBlog from "./components/CreateBlog";
import Togglable from "./components/Togglable";
import blogService from "./services/blogs";
import { AppBar, Toolbar, Button } from "@mui/material";


const App = () => {
  const [blogs, setBlogs] = useState([]);
  // const [showAll, setShowAll] = useState(true)
  // const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const [notification, setNotification] = useState({
    message: null,
    type: null,
  });

  const notify = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: null, type: null });
    }, 5000);
  };

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogAppUser");
    setUser(null);
  };

  const style = {
    '&:hover': {bgcolor: 'primary.main', color: 'white'},
    marginRight: 2,
  };

  return (
    <Router>
      <div>
        <AppBar position="static">  
          <Toolbar> 
            
            <Button color="inherit" component={Link} to="/" sx={style}>
              Blogs
            </Button>
            <Button color="inherit" component={Link} to="/create" sx={style}>
              New Blog
            </Button>
            {user ? (
              <Button color="inherit" onClick={handleLogout} sx={style}>
                Logout
              </Button>
            ) : (
              <Button color="inherit" component={Link} to="/login" sx={style}>
                Login
              </Button>
            )}
          </Toolbar>
        </AppBar>
        
        <Notification message={notification.message} type={notification.type} /> 
      </div>
      <Routes>
        <Route
          path="/create"
          element={
            <CreateBlog
              blogs={blogs}
              setBlogs={setBlogs}
              notify={notify}
              setTitle={setTitle}
              title={title}
              setAuthor={setAuthor}
              author={author}
              setUrl={setUrl}
              url={url}
            />
          }
        />
        <Route
          path="/blogs/:id"
          element={
            <Blog
              blogs={blogs}
              user={user}
              notify={notify}
              setBlogs={setBlogs}
            />
          }
        />
        <Route
          path="/"
          element={
            <BlogList
              blogs={blogs}
              setBlogs={setBlogs}
              user={user}
              notify={notify}
            />
          }
        />

        <Route
          path="/login"
          element={
            <UserLogin
              username={username}
              password={password}
              setUser={setUser}
              setUsername={setUsername}
              setPassword={setPassword}
              notify={notify}
            />
          }
        />
      
      </Routes>
    </Router>
  );
};
export default App;
