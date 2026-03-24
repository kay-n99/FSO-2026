import { test, expect } from "@playwright/test";

test.describe("Blog app", () => {
  test.beforeEach(async ({ page, request }) => {
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
    const header = await page.getByText("Log in to application");
    await expect(header).toBeVisible();
  });

  test.describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await page.getByLabel("username").fill("mluukkai");
      await page.getByLabel("password").fill("password123");
      await page.getByRole("button", { name: "login" }).click();

      await expect(page.getByText("mluukkai logged in")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await page.getByLabel("username").fill("mluukkai");
      await page.getByLabel("password").fill("wrong");
      await page.getByRole("button", { name: "login" }).click();

      const errorDiv = await page.locator(".error");
      await expect(errorDiv).toBeVisible();
      await expect(errorDiv).toHaveCSS("color", "rgb(255, 0, 0)");
      await expect(page.getByText("mluukkai logged in")).not.toBeVisible();
    });
  });
});

test.describe("When logged in", () => {
  test.beforeEach(async ({ page, request }) => {
    await request.post("http://localhost:3003/api/testing/reset");
    await request.post("http://localhost:3003/api/users", {
      data: {
        username: "mluukkai",
        password: "password123",
        name: "Matti Luukkainen",
      },
    });

    await page.goto("http://localhost:5173");

    await page.getByLabel("username").fill("mluukkai");
    await page.getByLabel("password").fill("password123");
    await page.getByRole("button", { name: "login" }).click();
    await expect(page.getByText("mluukkai logged in")).toBeVisible();
  });

  test("a new blog can be created", async ({ page }) => {
    await page.getByRole("button", { name: "new blog" }).click();
    await page.getByLabel("title").fill("A blog created by playwright");
    await page.getByLabel("author").fill("Test Author");
    await page.getByLabel("url").fill("https://playwright.dev");
    await page.getByRole("button", { name: "create" }).click();

    await expect(
      page.getByText("A blog created by playwright by Test Author"),
    ).toBeVisible();
  });

  test("a blog can be liked", async ({ page }) => {
    const uniqueTitle = `Like Test ${Math.floor(Math.random() * 1000)}`;

    await page.getByRole("button", { name: "new blog" }).click();
    await page.getByLabel("title").fill(uniqueTitle);
    await page.getByLabel("author").fill("Test Author");
    await page.getByLabel("url").fill("https://test.com");
    await page.getByRole("button", { name: "create" }).click();

    const blogElement = page.locator(".blog").filter({ hasText: uniqueTitle });
    await blogElement.getByRole("button", { name: "view" }).click();

    // Use a more resilient check: check that likes contain '0'
    // without being strict about the exact string "likes 0"
    const likesDiv = blogElement.getByTestId("likes");
    await expect(likesDiv).toContainText("0");

    await blogElement.getByRole("button", { name: "like" }).click();

    // Verify it changes to 1
    await expect(likesDiv).toContainText("1");
  });
});
