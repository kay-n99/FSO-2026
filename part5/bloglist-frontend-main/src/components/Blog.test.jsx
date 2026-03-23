import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";
import { expect, test } from "vitest";

test("renders title and author, but not url/likes by default", () => {
  const blog = {
    title: "Component",
    author: "Test Author",
    url: "https://testurl.com",
    likes: 5,
    user: { name: "Superuser" },
  };

  render(
    <Blog
      blog={blog}
      handleLike={() => {}}
      handleDelete={() => {}}
      user={{ username: "test" }}
    />,
  );

  const element = screen.getByText(/Component/i);
  expect(element).toBeDefined();

  const authorElement = screen.getByText(/Test Author/i);
  expect(authorElement).toBeDefined();

  const urlElement = screen.queryByText("https://testurl.com");
  expect(urlElement).toBeNull();

  const likesElement = screen.queryByText("likes 5");
  expect(likesElement).toBeNull();
});

test("button shows details clicked and showing url and link", async () => {
  const blog = {
    title: "Testing user interactions",
    author: "Test Author",
    url: "https://testurl.com",
    likes: 5,
    user: {
      username: "testuser",
      name: "Superuser",
    },
  };

  const mockUser = {
    username: "testuser",
  };

  render(
    <Blog
      blog={blog}
      user={mockUser}
      handleLike={() => {}}
      handleDelete={() => {}}
    />,
  );

  const user = userEvent.setup();
  const button = screen.getByText("view");
  await user.click(button);

  const urlElement = screen.getByText("https://testurl.com");
  expect(urlElement).toBeDefined();

  const likesElement = screen.getByText(/likes: 5/);
  expect(likesElement).toBeDefined();

  const nameElement = screen.getByText('Superuser')
  expect(nameElement).toBeDefined();
});
