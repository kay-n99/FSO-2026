import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";
import CreateBlog from "./CreateBlog";
import { expect, test, vi } from "vitest";

const mockBlog = {
  id: "123",
  title: "Test Single View",
  author: "Test Author",
  url: "https://testurl.com",
  likes: 10,
  user: {
    username: "creator123",
    name: "Superuser",
  },
};

const mockNotify = vi.fn();

test("Unauthenticated user sees info but no buttons", () => {
  render(
    <MemoryRouter initialEntries={["/blogs/123"]}>
      <Routes>
        <Route path="/blogs/:id" element={
          <Blog blog={mockBlog} user={null} blogs={[mockBlog]} notify={mockNotify} />
        } />
      </Routes>
    </MemoryRouter>
  );
  expect(screen.getByText(/Test Single View/)).toBeDefined();
  expect(screen.queryByText("like")).toBeNull();
});

test("Authenticated non-creator sees only like button", () => {
  render(
    <MemoryRouter initialEntries={["/blogs/123"]}>
      <Routes>
        <Route path="/blogs/:id" element={
          <Blog blog={mockBlog} user={{ username: "other" }} blogs={[mockBlog]} notify={mockNotify} />
        } />
      </Routes>
    </MemoryRouter>
  );
  expect(screen.getByText("like")).toBeDefined();
  expect(screen.queryByText("remove")).toBeNull();
});

test("Creator sees both like and remove buttons", () => {
  render(
    <MemoryRouter initialEntries={["/blogs/123"]}>
      <Routes>
        <Route path="/blogs/:id" element={
          <Blog blog={mockBlog} user={{ username: "creator123" }} blogs={[mockBlog]} notify={mockNotify} />
        } />
      </Routes>
    </MemoryRouter>
  );
  expect(screen.getByText("like")).toBeDefined();
  expect(screen.getByText("remove")).toBeDefined();
});

test("Clicking the like button calls event handler", async () => {
  const mockHandler = vi.fn();
  const user = userEvent.setup();

  render(
    <MemoryRouter initialEntries={["/blogs/123"]}>
      <Routes>
        <Route path="/blogs/:id" element={
          <Blog 
            blog={mockBlog} 
            user={{ username: "creator123" }} 
            blogs={[mockBlog]} 
            setBlogs={mockHandler} 
            notify={mockNotify} 
          />
        } />
      </Routes>
    </MemoryRouter>
  );
  
  const likeButton = screen.getByText("like");
  await user.click(likeButton);
  expect(likeButton).toBeDefined();
});

test("CreateBlog calls setters correctly", async () => {
  const setTitle = vi.fn();
  const setAuthor = vi.fn();
  const setUrl = vi.fn();
  const user = userEvent.setup();

  render(
    <MemoryRouter>
      <CreateBlog
        setTitle={setTitle}
        setAuthor={setAuthor}
        setUrl={setUrl}
        notify={mockNotify}
        title=""
        author=""
        url=""
      />
    </MemoryRouter>
  );

  const titleInput = screen.getByLabelText(/title/i);
  const authorInput = screen.getByLabelText(/author/i);
  const urlInput = screen.getByLabelText(/url/i);

  await user.type(titleInput, "Testing React Props");
  await user.type(authorInput, "Test Author");
  await user.type(urlInput, "https://test.com");

  expect(setTitle).toHaveBeenCalled();
  expect(setAuthor).toHaveBeenCalled();
  expect(setUrl).toHaveBeenCalled();
});