const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if(authorization && authorization.startsWith('Bearer ')){
    return authorization.replace('Bearer ', '')
  }
  return null
}

blogsRouter.get("/", async (request, response) => {
  // Blog.find({}).then((blogs) => {
  //   response.json(blogs)
  // })
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1});
  response.json(blogs);
});

blogsRouter.post("/", async (request, response, next) => {
  const body = request.body;
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if(!decodedToken.id){
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)
  // const user = await User.findById(body.userId)

  if(!user){
    return response.status(400).json({ error: 'userId missing or not valid'})
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  try {
    const savedBlog = await blog.save();
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
  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

blogsRouter.put("/:id", async (request, response) => {
  const { likes } = request.body;

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { likes },
    { new: true, runValidators: true, context: "query" },
  );

  response.json(updatedBlog);
});

module.exports = blogsRouter;
