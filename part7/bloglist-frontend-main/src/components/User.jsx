import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import userService from '../services/users'
import { Typography, List, ListItem, ListItemText, Paper } from '@mui/material'

const User = () => {
  const id = useParams().id;

  const result = useQuery({
    queryKey: ["users"],
    queryFn: userService.getAll,
  });

  if (result.isLoading) return <div>loading...</div>;
  const user = result.data?.find((u) => u.id == id);
  if (!user) return <div>User not found</div>;

  return (
    <div style={{ marginTop: 20 }}>
      <Typography variant="h4">{user.name}</Typography>
      <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
        Added blogs
      </Typography>
      <Paper elevation={3}>
        <List>
          {user.blogs.map((blog) => (
            <ListItem key={blog.id} divider>
              <ListItemText primary={blog.title} />
            </ListItem>
          ))}
        </List>
      </Paper>
      {user.blogs.length === 0 && (
        <Typography sx={{ p: 2 }}>
          This user hasn't added any blogs yet.
        </Typography>
      )}
    </div>
  );
};

export default User
