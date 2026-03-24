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

      const errorDiv = page.locator(".error");
      await expect(errorDiv).toBeVisible();
      await expect(errorDiv).toHaveCSS("color", "rgb(255, 0, 0)");
      await expect(page.getByText("mluukkai logged in")).not.toBeVisible();
    });
  });
});

test.describe("When logged in", () => {
  test.beforeEach(async ({ page, request }) => {
    // 1. Reset DB
    await request.post("http://localhost:3003/api/testing/reset");

    // 2. Create User
    await request.post("http://localhost:3003/api/users", {
      data: {
        username: "mluukkai",
        password: "password123",
        name: "Matti Luukkainen",
      },
    });

    // 3. Go to app
    await page.goto("http://localhost:5173");
    await page.evaluate(() => localStorage.clear());

    // 4. Perform Login
    await page.getByLabel("username").fill("mluukkai");
    await page.getByLabel("password").fill("password123");
    await page.getByRole("button", { name: "login" }).click();

    // --- CRITICAL STEP ---
    // Wait for the UI to change so we know we are logged in!
    // If this fails, it means your login logic in App.jsx isn't working with the reset user.
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

    const likesDiv = blogElement.getByTestId("likes");
    await expect(likesDiv).toContainText("0");

    await blogElement.getByRole("button", { name: "like" }).click();

    await expect(likesDiv).toContainText("1");
  });

  test("a blog can be deleted by the user who created it", async ({ page }) => {
    const blogTitle = `Delete Me ${Math.floor(Math.random() * 1000)}`;

    await page.getByRole("button", { name: "new blog" }).click();
    await page.getByLabel("title").fill(blogTitle);
    await page.getByLabel("author").fill("Test Author");
    await page.getByLabel("url").fill("https://delete-me.com");
    await page.getByRole("button", { name: "create" }).click();

    const blogElement = page.locator(".blog").filter({ hasText: blogTitle });

    await blogElement.getByRole("button", { name: "view" }).click();

    const removeButton = blogElement.getByRole("button", { name: "remove" });

    page.on("dialog", async (dialog) => {
      await dialog.accept();
    });

    await removeButton.click();

    await expect(
      page.locator(".blog").filter({ hasText: blogTitle }),
    ).toHaveCount(0);
  });
});
