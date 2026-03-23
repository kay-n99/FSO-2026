import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import CreateBlog from './components/CreateBlog'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  // const [showAll, setShowAll] = useState(true)
  // const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [notification, setNotification] = useState({
    message: null,
    type: null,
  })

  const notify = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification({ message: null, type: null })
    }, 5000)
  }

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)

      setUser(user)
      notify(`Welcome back, ${user.name}`)
      setUsername('')
      setPassword('')
    } catch {
      notify('wrong username or password')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const handleNew = async (event) => {
    event.preventDefault()

    try {
      const newBlog = { title, author, url }
      const returnedBlog = await blogService.create(newBlog)

      setBlogs(blogs.concat(returnedBlog))
      setTitle('')
      setAuthor('')
      setUrl('')
      notify(`a new blog ${title} by ${author} added`)
    } catch {
      notify('failed to create blog: check all fields')
    }
  }

  const handleLike = async (blog) => {
    try {
      const updatedBlog = {
        user: blog.user.id || blog.user,
        likes: blog.likes + 1,
        author: blog.author,
        title: blog.title,
        url: blog.url,
      }

      const returnedBlog = await blogService.update(blog.id, updatedBlog)
      setBlogs(blogs.map((b) => (b.id !== blog.id ? b : returnedBlog)))
    } catch {
      notify('error updating likes')
    }
  }

  const handleDelete = async (blog) => {
    if(window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)){
      try{
        await blogService.remove(blog.id)
        setBlogs(blogs.filter(b => b.id !== blog.id))
        notify(`Deleted ${blog.title}`)
      }catch(exception){
        console.error(exception)
        notify('Error deleting blog: Unauthorized', 'error')
      }
    }
  }

  return (
    <div>
      <Notification message={notification.message} type={notification.type} />
      {user === null ? (
        <div>
          <h2>Log in to application</h2>
          <form onSubmit={handleLogin}>
            <div>
              <label>
                username
                <input
                  type="text"
                  value={username}
                  onChange={({ target }) => setUsername(target.value)}
                />
              </label>
            </div>
            <div>
              <label>
                password
                <input
                  type="password"
                  value={password}
                  onChange={({ target }) => setPassword(target.value)}
                />
              </label>
            </div>
            <button type="submit">login</button>
          </form>
        </div>
      ) : (
        <div>
          <p>
            {user.username} logged in{' '}
            <button onClick={handleLogout}>logout</button>
          </p>

          <Togglable buttonLabel="new blog">
            <CreateBlog
              handleNew={handleNew}
              setTitle={setTitle}
              title={title}
              setAuthor={setAuthor}
              author={author}
              setUrl={setUrl}
              url={url}
            />
          </Togglable>
          <h2>blogs</h2>
          {[...blogs].sort((a,b) => b.likes - a.likes).map((blog) => (
            <Blog key={blog.id} blog={blog} handleLike={handleLike} handleDelete={handleDelete} user={user} />
          ))}
        </div>
      )}
    </div>
  )
}
export default App
