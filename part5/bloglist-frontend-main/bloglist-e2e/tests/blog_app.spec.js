import { test, expect } from "@playwright/test";

test.describe("Blog app", () => {
  test.beforeEach(async ({ page, request }) => {
    // Reset database and seed a user
    await request.post("http://localhost:3003/api/testing/reset");
    await request.post("http://localhost:3003/api/users", {
      data: {
        username: "mluukkai",
        password: "password123",
        name: "Matti Luukkainen",
      },
    });

    await page.goto("http://localhost:5173");
  });

  test("Login form is shown", async ({ page }) => {
    await expect(page.getByText("Log in to application")).toBeVisible();
  });

  test.describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await page.getByLabel("username").fill("mluukkai");
      await page.getByLabel("password").fill("password123");
      await page.getByRole("button", { name: "login" }).click();

      await expect(page.getByText("Matti Luukkainen logged in")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await page.getByLabel("username").fill("mluukkai");
      await page.getByLabel("password").fill("wrong");
      await page.getByRole("button", { name: "login" }).click();

      const errorDiv = page.locator(".error");
      await expect(errorDiv).toBeVisible();
      await expect(errorDiv).toHaveCSS("color", "rgb(255, 0, 0)");
      await expect(page.getByText("Matti Luukkainen logged in")).not.toBeVisible();
    });
  });

  test.describe("When logged in", () => {
    test.beforeEach(async ({ page }) => {
      await page.getByLabel("username").fill("mluukkai");
      await page.getByLabel("password").fill("password123");
      await page.getByRole("button", { name: "login" }).click();
    });

    test("a new blog can be created", async ({ page }) => {
      await page.getByRole("link", { name: "create new" }).click();
      await page.getByLabel("title").fill("Testing Playwright");
      await page.getByLabel("author").fill("JS Expert");
      await page.getByLabel("url").fill("http://playwright.dev");
      await page.getByRole("button", { name: "create" }).click();

      // Verify notification and presence in list
      await expect(page.getByText("a new blog Testing Playwright by JS Expert added")).toBeVisible();
      await expect(page.getByRole("link", { name: "Testing Playwright JS Expert" })).toBeVisible();
    });

    test("a blog can be liked", async ({ page }) => {
      // Create a blog first
      await page.getByRole("link", { name: "create new" }).click();
      await page.getByLabel("title").fill("Likeable Blog");
      await page.getByLabel("author").fill("Tester");
      await page.getByLabel("url").fill("http://test.com");
      await page.getByRole("button", { name: "create" }).click();

      // Navigate to the single blog view
      await page.getByRole("link", { name: "Likeable Blog Tester" }).click();
      
      const likesSection = page.getByText(/likes/);
      await expect(likesSection).toContainText("0");

      await page.getByRole("button", { name: "like" }).click();
      await expect(likesSection).toContainText("1");
    });

    test("a blog can be deleted by the creator", async ({ page }) => {
      await page.getByRole("link", { name: "create new" }).click();
      await page.getByLabel("title").fill("Disposable Blog");
      await page.getByLabel("author").fill("Tester");
      await page.getByLabel("url").fill("http://test.com");
      await page.getByRole("button", { name: "create" }).click();

      await page.getByRole("link", { name: "Disposable Blog Tester" }).click();
      
      // Handle the window.confirm dialog
      page.on("dialog", dialog => dialog.accept());
      await page.getByRole("button", { name: "remove" }).click();

      // Should be redirected back to list and blog should be gone
      await expect(page.getByRole("link", { name: "Disposable Blog Tester" })).not.toBeVisible();
    });

    test("only the creator can see the remove button", async ({ page, request }) => {
      // Create blog as mluukkai
      await page.getByRole("link", { name: "create new" }).click();
      await page.getByLabel("title").fill("Creator Only Blog");
      await page.getByLabel("author").fill("Tester");
      await page.getByLabel("url").fill("http://test.com");
      await page.getByRole("button", { name: "create" }).click();

      // Create a second user via API
      await request.post("http://localhost:3003/api/users", {
        data: { username: "other", password: "password", name: "Other User" }
      });

      // Logout and login as other user
      await page.getByRole("button", { name: "logout" }).click();
      await page.getByLabel("username").fill("other");
      await page.getByLabel("password").fill("password");
      await page.getByRole("button", { name: "login" }).click();

      // View the blog created by mluukkai
      await page.getByRole("link", { name: "Creator Only Blog Tester" }).click();
      
      // The remove button should NOT be present
      await expect(page.getByRole("button", { name: "remove" })).not.toBeVisible();
    });

    test("blogs are ordered according to likes", async ({ page }) => {
      // Create two blogs
      const blogs = [
        { title: "Second Place", author: "A", url: "http://a.com" },
        { title: "First Place", author: "B", url: "http://b.com" }
      ];

      for (const b of blogs) {
        await page.getByRole("link", { name: "create new" }).click();
        await page.getByLabel("title").fill(b.title);
        await page.getByLabel("author").fill(b.author);
        await page.getByLabel("url").fill(b.url);
        await page.getByRole("button", { name: "create" }).click();
      }

      // Like "First Place" twice
      await page.getByRole("link", { name: "First Place B" }).click();
      await page.getByRole("button", { name: "like" }).click();
      await page.waitForResponse(res => res.url().includes('/api/blogs') && res.status() === 200);
      await page.getByRole("button", { name: "like" }).click();
      await page.waitForResponse(res => res.url().includes('/api/blogs') && res.status() === 200);

      // Go back to home
      await page.getByRole("link", { name: "blogs" }).click();

      // Check order
      const blogLinks = page.locator('.blog-list-item'); // Assuming you have a class for list items
      await expect(blogLinks.first()).toContainText("First Place");
      await expect(blogLinks.last()).toContainText("Second Place");
    });
  });
});