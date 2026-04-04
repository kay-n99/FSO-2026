import Blog from "./Blog";
import blogService from "../services/blogs";
import { Link } from "react-router-dom";

const BlogList = ({ blogs, setBlogs, user, notify }) => {
  

  return (
    <>
      <h2>blogs</h2>
      {[...blogs]
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
            <ul>
            <li key={blog.id}>
                <Link to={`/blogs/${blog.id}`}>
                {blog.title} by {blog.author}
                </Link>
            </li>
            </ul>
        //   <Blog
        //     key={blog.id}
        //     blog={blog}
        //     handleLike={handleLike}
        //     handleDelete={handleDelete}
        //     user={user}
        //   />
        ))}
    </>
  );
};

export default BlogList;
