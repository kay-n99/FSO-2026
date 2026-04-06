import blogService from "../services/blogs";
import { TextField, Button } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const CreateBlog = ({
  setTitle,
  title,
  setAuthor,
  author,
  setUrl,
  url,
  notify,
}) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      notify(`a new blog ${newBlog.title} by ${newBlog.author} added`);
      setTitle("");
      setAuthor("");
      setUrl("");
      navigate("/");
    },
    onError: (error) => {
      notify(error.response?.data?.error || "Error creating blog", "errro");
    },
  });

  const handleNew = async (event) => {
    event.preventDefault();
    newBlogMutation.mutate({ title, author, url });
  };

  // const handleNew = async (event) => {
  //   event.preventDefault();

  //   try {
  //     const newBlog = { title, author, url };
  //     const returnedBlog = await blogService.create(newBlog);
  //     console.log(returnedBlog);
  //     setBlogs(blogs.concat(returnedBlog));
  //     setTitle("");
  //     setAuthor("");
  //     setUrl("");
  //     notify(`a new blog ${title} by ${author} added`);
  //     navigate("/");
  //   } catch {
  //     notify("failed to create blog: check all fields");
  //   }
  // };

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
  );
};
export default CreateBlog;
