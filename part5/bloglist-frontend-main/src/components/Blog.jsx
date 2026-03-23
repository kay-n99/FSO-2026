import { useState } from "react";

const Blog = ({ blog, handleLike, handleDelete, user }) => {
  const [visible, setVisible] = useState(false);

  const showWhenVisible = { display: visible ? "" : "none" };
  const label = visible ? "hide" : "view";
  const showDeleteButton = blog.user.username === user.username;

  const toggleVisibility = () => {
    setVisible(!visible);
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
        <button onClick={toggleVisibility}>{label}</button>
      </div>
      {visible && (
      <div  className="blog-details">
        <span>{blog.url}</span>
        <br />
        <span>
          likes: {blog.likes}
          <button onClick={() => handleLike(blog)}>like</button>
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
      )}
    </div>
  );
};

export default Blog;
