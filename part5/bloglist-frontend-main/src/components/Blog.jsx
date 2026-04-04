import { useState, useEffect} from "react";
import { useParams, useNavigate } from "react-router-dom";
import blogService from "../services/blogs";

const Blog = ({ blogs, setBlogs, notify , user, }) => {
  const id = useParams().id  
  const blog = blogs.find(n => n.id === id)
  console.log('Current blog likes in render:', blog?.likes)
  if(!blog) return null;
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  const showWhenVisible = { display: visible ? "" : "none" };
  const label = visible ? "hide" : "view";
  const showDeleteButton = user && blog.user.username === user.username;
  const isLoggedIn = user !== null;
  // if(user) {const showDeleteButton = blog.user.username === user.username;}
  

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const handleLike = async (blog) => {
    try {
      const updatedBlog = {
        user: blog.user.id || blog.user,
        likes: blog.likes + 1,
        author: blog.author,
        title: blog.title,
        url: blog.url,
      };

      const returnedBlog = await blogService.update(blog.id, updatedBlog);
      setBlogs(blogs.map((b) => (b.id !== blog.id ? b : returnedBlog)));
    } catch {
      notify("error updating likes");
    }
  };

  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      try {
        await blogService.remove(blog.id);
        setBlogs(blogs.filter((b) => b.id !== blog.id));
        notify(`Deleted ${blog.title}`);
        navigate("/");
      } catch (exception) {
        console.error(exception);
        notify("Error deleting blog: Unauthorized", "error");
      }
    }
  };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div style={blogStyle} className="blog">
      <div className="blog-main">
        {blog.title} {blog.author}
        {/* <button onClick={toggleVisibility}>{label}</button> */}
      </div>
      {/* {visible && ( */}
        <div className="blog-details">
          <span>{blog.url}</span>
          <br />
          <span>
            <div className="likes" data-testid="likes">
              likes {blog.likes}
            </div>
            {isLoggedIn && <button onClick={() => handleLike(blog)}>like</button>}
          </span>
          <br />
          <span>{blog.user.name}</span>
          <br />

          {showDeleteButton && (
            <button
              style={{
                backgroundColor: "blue",
                color: "white",
                borderRadius: "5px",
              }}
              onClick={() => handleDelete(blog)}
            >
              remove
            </button>
          )}
        </div>
      {/* )} */}
    </div>
  );
};

export default Blog;
