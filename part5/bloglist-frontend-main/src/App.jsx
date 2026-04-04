import { useState, useEffect } from "react";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import BlogList from "./components/BlogList";
import Blog from "./components/Blog";
import UserLogin from "./components/UserLogin";
import Notification from "./components/Notification";
import CreateBlog from "./components/CreateBlog";
import Togglable from "./components/Togglable";
import blogService from "./services/blogs";

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

  const padding = {
    padding: 5,
  };

  return (
    <Router>
      <div>
        <Link style={padding} to="/">
          blogs
        </Link>
        <Link style={padding} to="/create">
          new blog
        </Link>
        {user ? (
          <button onClick={handleLogout} style={padding}>
            logout
          </button>
        ) : (
          <Link style={padding} to="/login">
            login
          </Link>
        )}
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
    // <div>
    //   <Notification message={notification.message} type={notification.type} />
    //   {user === null ? (
    //     <BlogList blogs={blogs} setBlogs={setBlogs} user={user} notify={notify} />
    //   ) : (
    //     <div>
    //       {/* <p>
    //         {user.username} logged in{' '}
    //         <button onClick={handleLogout}>logout</button>
    //       </p>

    //       <Togglable buttonLabel="new blog">
    //         <CreateBlog
    //           handleNew={handleNew}
    //           setTitle={setTitle}
    //           title={title}
    //           setAuthor={setAuthor}
    //           author={author}
    //           setUrl={setUrl}
    //           url={url}
    //         />
    //       </Togglable> */}

    //     </div>
    //   )}
    // </div>
  );
};
export default App;
