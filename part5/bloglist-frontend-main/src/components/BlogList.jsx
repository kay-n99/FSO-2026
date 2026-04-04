import Blog from "./Blog";
import blogService from "../services/blogs";
const BlogList = ({ blogs, setBlogs, user, notify }) => {
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
      } catch (exception) {
        console.error(exception);
        notify("Error deleting blog: Unauthorized", "error");
      }
    }
  };

  return (
    <>
      <h2>blogs</h2>
      {[...blogs]
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            handleLike={handleLike}
            handleDelete={handleDelete}
            user={user}
          />
        ))}
    </>
  );
};

export default BlogList;
