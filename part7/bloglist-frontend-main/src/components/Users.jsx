import { useQuery } from '@tanstack/react-query'
import userService from '../services/users'
import { 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Typography 
} from '@mui/material'
import { Link } from 'react-router-dom'

const Users = () => {
    const result = useQuery({
        queryKey: ['users'],
        queryFn: userService.getAll
    })

    if(result.isLoading){
        return <div>loading users...</div>
    }

    const users = result.data

    return(
        <div>
      <Typography variant="h4" component="h2" sx={{ my: 2 }}>
        Users
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>User Name</strong></TableCell>
              <TableCell><strong>Blogs Created</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell>
                    <Link to={`/users/${user.id}`}>{user.name}</Link></TableCell>
                <TableCell>{user.blogs.length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
    )
}

export default Users