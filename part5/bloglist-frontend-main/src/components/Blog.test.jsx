import { render, screen } from "@testing-library/react";
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
