import {useNavigate } from "react-router-dom";
import blogService from "../services/blogs";
import { TextField, Button } from "@mui/material";

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
          <TextField
            label="Title"
            value={title}
              onChange={({ target }) => setTitle(target.value)}
            />
          
        </div>
        <div>
          <TextField
            label="Author"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          <TextField
            label="URL"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <Button type="submit" variant="contained" color="primary">
          create
        </Button>
      </form>
    </div>
  )
}
export default CreateBlog
