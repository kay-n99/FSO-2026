const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require('../models/user');
const jwt = require('jsonwebtoken');

// const getTokenFrom = request => {
//   const authorization = request.get('authorization')
//   if(authorization && authorization.startsWith('Bearer ')){
//     return authorization.replace('Bearer ', '')
//   }
//   return null
// }

blogsRouter.get("/", async (request, response) => {
  // Blog.find({}).then((blogs) => {
  //   response.json(blogs)
  // })
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1});
  response.json(blogs);
});

blogsRouter.post("/", async (request, response, next) => {
  // const decodedToken = jwt.verify(request.token, process.env.SECRET)
  // if(!decodedToken.id){
  //   return response.status(401).json({ error: 'token invalid' })
  // }
  const user = request.user
  // const user = await User.findById(body.userId)

  if(!user){
    return response.status(401).json({ error: 'token missing or not valid'})
  }

  const blog = new Blog({
    ...request.body,
    user: user._id
  })

  try {
    const savedBlog = await blog.save();
    await savedBlog.populate('user', { username: 1, name: 1 })
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog);
  } catch (exception) {
    next(exception);
  }

  // blog.save().then((result) => {
  //   response.status(201).json(result)
  // })
});

blogsRouter.delete("/:id", async (request, response) => {
  // if(!request.token){
  //   return response.status(401).json({ error: 'token misisng' })
  // }
  // const decodedToken = jwt.verify(request.token, process.env.SECRET)
  // if(!decodedToken.id){
  //   return response.status(401).json({ error: 'token invalid' })
  // }
  const user = request.user

  const blog = await Blog.findById(request.params.id)
  if(!blog){
    return response.status(404).json({error: 'blog not found' })
  }

  if(!user || blog.user.toString() !== user.id.toString()){
    return response.status(401).json({ error: 'operation not permitted'})
  }

  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

blogsRouter.put("/:id", async (request, response) => {
  const { user, likes, author, title, url } = request.body;

  const blog = {
    user: user,
    likes: likes,
    author: author,
    title: title,
    url: url,
  }

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    blog,
    {returnDocument: 'after'}
  ).populate('user', {username: 1, name: 1});

  if (updatedBlog) {
    response.json(updatedBlog)
  } else {
    response.status(404).end()
  }
});

module.exports = blogsRouter;
