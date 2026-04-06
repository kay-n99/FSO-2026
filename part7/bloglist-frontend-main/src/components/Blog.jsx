import { useParams, useNavigate } from "react-router-dom";
import blogService from "../services/blogs";
import { 
  Button, 
  Typography, 
  Card, 
  CardContent, 
  CardActions, 
  Stack, 
  Link,
  Divider 
} from "@mui/material";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import DeleteIcon from '@mui/icons-material/Delete';
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useUserValue } from '../UserContext'

const Blog = ({ blogs, notify }) => {
  const user = useUserValue();
  const id = useParams().id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const deleteBlogMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs']})
      notify('Blog removed successfully')
    },
    onError: (error) => {
      const message =  error.response?.data?.error || 'Failed to remove blog'
      notify(message, 'error')
    }
  })

  const updateBlogMutation = useMutation({
    mutationFn: (updatedBlog) => {
      return blogService.update(updatedBlog.id, updatedBlog)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs']})
      notify(`You liked '${updatedBlog.title}`)
    }
  })

  const blog = blogs.find((n) => n.id === id);

  if (!blog) return <Typography variant="h6">Blog not found</Typography>;

  const showDeleteButton = user && blog.user.username === user.username;

  const handleLike = () => {
    const updatedBlog =  {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id || blog.user
    }
    updateBlogMutation.mutate(updatedBlog)
    // try {
    //   const updatedBlog = {
    //     ...blog,
    //     user: blog.user.id || blog.user,
    //     likes: blog.likes + 1,
    //   };
    //   const returnedBlog = await blogService.update(blog.id, updatedBlog);
    //   setBlogs(blogs.map((b) => (b.id !== blog.id ? b : returnedBlog)));
    // } catch {
    //   notify("Error updating likes", "error");
    // }
  };

  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      deleteBlogMutation.mutate(blog.id)
      navigate("/");
      // try {
      //   await blogService.remove(blog.id);
      //   setBlogs(blogs.filter((b) => b.id !== blog.id));
      //   notify(`Deleted ${blog.title}`);
      //   navigate("/");
      // } catch (exception) {
      //   notify("Error deleting blog: Unauthorized", "error");
      // }
    }
  };

  

  return (
    <Card variant="outlined" sx={{ maxWidth: 600, mt: 4, mx: "auto", boxShadow: 3 }}>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h4" component="h2" gutterBottom color="primary">
            {blog.title}
          </Typography>
          
          <Typography variant="subtitle1" color="text.secondary">
            Author: <strong>{blog.author}</strong>
          </Typography>
          
          <Divider />

          <Link href={blog.url} target="_blank" rel="noopener" underline="hover">
            {blog.url}
          </Link>

          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="body1" data-testid="likes">
              <strong>{blog.likes}</strong> likes
            </Typography>
            {user && (
              <Button 
                variant="contained" 
                size="small" 
                startIcon={<ThumbUpIcon />} 
                onClick={() => handleLike(blog)}
              >
                Like
              </Button>
            )}
          </Stack>

          <Typography variant="body2" color="text.secondary">
            Added by <em>{blog.user.name}</em>
          </Typography>
        </Stack>
      </CardContent>

      <CardActions sx={{ justifyContent: "flex-end", p: 2 }}>
        {showDeleteButton && (
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => handleDelete(blog)}
          >
            Remove
          </Button>
        )}
        <Button size="small" onClick={() => navigate("/")}>
          Back to List
        </Button>
      </CardActions>
    </Card>
  );
};

export default Blog;