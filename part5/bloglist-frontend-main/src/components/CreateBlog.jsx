import {useNavigate } from "react-router-dom";
import blogService from "../services/blogs";

const CreateBlog = ({
  blogs,
  setBlogs,
  setTitle,
  title,
  setAuthor,
  author,
  setUrl,
  url,
  notify
}) => {
  const navigate = useNavigate();

  const handleNew = async (event) => {
    event.preventDefault();

    try {
      
      const newBlog = { title, author, url };
      const returnedBlog = await blogService.create(newBlog);
      console.log(returnedBlog);
      setBlogs(blogs.concat(returnedBlog));
      setTitle("");
      setAuthor("");
      setUrl("");
      notify(`a new blog ${title} by ${author} added`);
      navigate("/");
    } catch {
      notify("failed to create blog: check all fields");
    }
  };

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleNew}>
        <div>
          <label>
            title
            <input
              type="text"
              value={title}
              onChange={({ target }) => setTitle(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            author
            <input
              type="text"
              value={author}
              onChange={({ target }) => setAuthor(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            url
            <input
              type="text"
              value={url}
              onChange={({ target }) => setUrl(target.value)}
            />
          </label>
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}
export default CreateBlog
