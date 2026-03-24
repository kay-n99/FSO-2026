import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";
import CreateBlog from "./CreateBlog";
import { expect, test, vi } from "vitest";

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

  const nameElement = screen.getByText("Superuser");
  expect(nameElement).toBeDefined();
});

test("if like button clicked twice, event handler called twice", async () => {
  const blog = {
    title: "Testing mock functions",
    author: "Test Author",
    url: "https://testurl.com",
    likes: 5,
    user: {
      username: "testuser",
      name: "Superuser",
    },
  };

  const mockUser = { username: "testuser" };
  const mockHandler = vi.fn();

  render(
    <Blog
      blog={blog}
      user={mockUser}
      handleLike={mockHandler}
      handleDelete={() => {}}
    />,
  );

  const user = userEvent.setup();

  const viewButton = screen.getByText("view");
  await user.click(viewButton);

  const likeButton = screen.getByText("like");
  await user.click(likeButton);
  await user.click(likeButton);

  expect(mockHandler.mock.calls).toHaveLength(2);
});

test("CreateBlog calls setters and handleNew correctly", async () => {
  const handleNew = vi.fn((e) => e.preventDefault());
  const setTitle = vi.fn();
  const setAuthor = vi.fn();
  const setUrl = vi.fn();

  const user = userEvent.setup();

  render(
    <CreateBlog
      handleNew={handleNew}
      setTitle={setTitle}
      setAuthor={setAuthor}
      setUrl={setUrl}
      title=""
      author=""
      url=""
    />,
  );

  const titleInput = screen.getByLabelText(/title/i);
  const authorInput = screen.getByLabelText(/author/i);
  const urlInput = screen.getByLabelText(/url/i);
  const createButton = screen.getByText("create");

  await user.type(titleInput, "Testing React Props");
  await user.type(authorInput, "Test Author");
  await user.type(urlInput, "https://test.com");

  await user.click(createButton);

  expect(setTitle).toHaveBeenCalled();
  expect(setAuthor).toHaveBeenCalled();
  expect(setUrl).toHaveBeenCalled();

  expect(handleNew).toHaveBeenCalledTimes(1);
});
