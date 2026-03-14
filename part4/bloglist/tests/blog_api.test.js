const { test, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");

const initialBlogs = [
  { title: "test1", author: "gili", url: "https://testhis.com/", likes: 7 },
  { title: "test2", author: "gila", url: "https://testhat.com/", likes: 24 },
];

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(initialBlogs);
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
  const initialResponse = await api.get("/api/blogs");
  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const afterResponse = await api.get("/api/blogs");

  assert.strictEqual(
    afterResponse.body.length,
    initialResponse.body.length + 1,
  );

  const titles = afterResponse.body.map((r) => r.title);
  assert.ok(titles.includes("newblogge"));
});

test("if the likes property is missing, it defaults to 0", async () => {
  const newBlog = {
    title: "Testing default likes",
    author: "Test",
    url: "https://test.com",
  };

  const response = await api
    .post("/api/blogs")
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

  await api   
    .post("/api/blogs")
    .send(newBlog)
    .expect(400)
})

after(async () => {
  await mongoose.connection.close();
});
