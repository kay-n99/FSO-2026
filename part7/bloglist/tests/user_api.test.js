const { test, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const User = require("../models/user");

beforeEach(async () => {
  await User.deleteMany({});
});

test("creation fails wiht proper status if pass too short", async () => {
  const newUser = {
    username: "root",
    name: "Superuser",
    password: "12",
  };

  const result = await api
    .post("/api/users")
    .send(newUser)
    .expect(400)
    .expect("Content-Type", /application\/json/);

  assert.ok(
    result.body.error.includes("password must be at least 3 char long"),
  );
});

test("creation fails if username not unique", async () => {
  const newUser = {
    username: "root",
    name: "Superuser",
    password: "password",
  };

  await api.post("/api/users").send(newUser);

  const result = await api
    .post("/api/users")
    .send(newUser)
    .expect(400)
    .expect("Content-Type", /application\/json/);

  assert.ok(result.body.error.includes("expected `username` to be unique"));
});

after(async () => {
  await mongoose.connection.close();
});
