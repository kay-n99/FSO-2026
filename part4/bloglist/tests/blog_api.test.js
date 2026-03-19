const { test, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");
const User = require("../models/user");

let token;

const initialBlogs = [
  { title: "test1", author: "gili", url: "https://testhis.com/", likes: 7 },
  { title: "test2", author: "gila", url: "https://testhat.com/", likes: 24 },
];

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash("password", 10);
  const user = new User({ username: "testuser", passwordHash });
  const savedUser = await user.save();

  const userForToken = {
    username: savedUser.username,
    id: savedUser._id, 
  };
  token = jwt.sign(userForToken, process.env.SECRET);

  const blogsWithUser = initialBlogs.map(blog => ({...blog, user: savedUser._id}));
  await Blog.insertMany(blogsWithUser)
  // await user.save();

  // const userForToken = {
  //   username: user.username,
  //   id: user._id,
  // };
  // token = jwt.sign(userForToken, process.env.SECRET);

  // await Blog.insertMany(initialBlogs);
});

test("blogs are returned as json", async () => {
  const response = await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);

  assert.strictEqual(response.body.length, initialBlogs.length);
});

test("unique identifier property of the blog posts is named id", async () => {
  const response = await api.get("/api/blogs");

  const blogToInspect = response.body[0];

  assert.ok(blogToInspect.id);
  assert.strictEqual(blogToInspect._id, undefined);
});

test("blogs are created successfully", async () => {
  const newBlog = {
    title: "newblogge",
    author: "who",
    url: "https://fulldot.com",
    likes: 10,
  };

  await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await api.get("/api/blogs");
  assert.strictEqual(blogsAtEnd.body.length, 3);
});

test("adding a blog fails if token is not provided", async () => {
  const newBlog = {
    title: "Blogga",
    author: "Noone",
    url: "https://tesahgas.com",
    likes: 0,
  };

  const result = await api.post("/api/blogs").send(newBlog).expect(401);

  assert.strictEqual(result.body.error, "token missing or not valid");
});

test("if the likes property is missing, it defaults to 0", async () => {
  const newBlog = {
    title: "Testing default likes",
    author: "Test",
    url: "https://test.com",
  };

  const response = await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  assert.strictEqual(response.body.likes, 0);
});

test("if the title or url are missing, respond 400", async () => {
  const newBlog = {
    author: "Test",
    likes: 4,
  };

  await api.post("/api/blogs").set("Authorization", `Bearer ${token}`).send(newBlog).expect(400);
});

test("a blog can be deleted", async () => {
  const initialBlogs = await api.get("/api/blogs");
  const deletedBlog = initialBlogs.body[0];

  await api.delete(`/api/blogs/${deletedBlog.id}`).set("Authorization", `Bearer ${token}`).expect(204);

  const afterBlogs = await api.get("/api/blogs");
  assert.strictEqual(afterBlogs.body.length, initialBlogs.body.length - 1);

  const titles = afterBlogs.body.map((r) => r.title);
  assert.ok(!titles.includes(deletedBlog.title));
});

test("blog likes can be updated", async () => {
  const initialBlogs = await api.get("/api/blogs");
  const updateBlog = initialBlogs.body[0];

  const updatedData = {
    likes: updateBlog.likes + 1,
  };

  await api.put(`/api/blogs/${updateBlog.id}`).send(updatedData).expect(200);

  const afterBlog = await api.get("/api/blogs");
  const updatedBlog = afterBlog.body.find((b) => b.id === updateBlog.id);

  assert.strictEqual(updatedBlog.likes, updateBlog.likes + 1);
});

after(async () => {
  await mongoose.connection.close();
});
