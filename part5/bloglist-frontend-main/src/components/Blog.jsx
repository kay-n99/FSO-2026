import { useState } from "react";

const Blog = ({ blog, handleLike }) => {
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = {display: visible ? "" : "none"} ;
  const label = visible ? "hide" : "view";

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <button onClick={toggleVisibility}>{label}</button>
      <div style={showWhenVisible}>
        <span>{blog.url}</span><br/>
        <span>likes: {blog.likes}<button onClick={() => handleLike(blog)}>like</button></span><br/>
        <span>{blog.user.name}</span><br/>
      </div>
    </div>
  );
};

export default Blog;
