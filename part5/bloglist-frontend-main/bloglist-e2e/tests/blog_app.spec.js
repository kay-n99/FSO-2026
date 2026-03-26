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

    await expect(page.getByRole("button", { name: "new blog" })).toBeVisible();
  });

  const createBlog = async (page, title, author, url) => {
    const formVisible = await page
      .getByRole("button", { name: "cancel" })
      .isVisible();

    if (!formVisible) {
      await page.getByRole("button", { name: "new blog" }).click();
    }

    await page.getByLabel("title").fill(title);
    await page.getByLabel("author").fill(author);
    await page.getByLabel("url").fill(url);
    await page.getByRole("button", { name: "create" }).click();

    await expect(
      page.locator(".blog").filter({ hasText: title }),
    ).toBeVisible();

    await page.waitForTimeout(500);
  };

  test("a new blog can be created", async ({ page }) => {
    await createBlog(
      page,
      "A blog created by playwright",
      "Test Author",
      "https://playwright.dev",
    );

    const blog = page
      .locator(".blog")
      .filter({ hasText: "A blog created by playwright" });
    await expect(blog).toContainText("Test Author");
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

  test("only the creator can see the remove button", async ({
    page,
    request,
  }) => {
    const blogTitle = "Only creator should see remove button";

    await page.getByRole("button", { name: "new blog" }).click();
    await page.getByLabel("title").fill(blogTitle);
    await page.getByLabel("author").fill("Test Author");
    await page.getByLabel("url").fill("https://test.com");
    await page.getByRole("button", { name: "create" }).click();

    await expect(
      page.locator(".blog").filter({ hasText: blogTitle }),
    ).toBeVisible();

    await request.post("http://localhost:3003/api/users", {
      data: {
        username: "another",
        password: "password",
        name: "Another",
      },
    });

    await page.getByRole("button", { name: "logout" }).click();

    await page.getByLabel("username").fill("another");
    await page.getByLabel("password").fill("password");
    await page.getByRole("button", { name: "login" }).click();

    await expect(page.getByText("Another logged in")).toBeVisible();

    const blogElement = page.locator(".blog").filter({ hasText: blogTitle });

    await expect(blogElement).toBeVisible();
    await blogElement.getByRole("button", { name: "view" }).click();

    const removeButton = blogElement.getByRole("button", { name: "remove" });
    await expect(removeButton).not.toBeVisible();
  });

  test("blogs are ordered according to likes", async ({ page }) => {
    await createBlog(page, "Middle Blog", "Author", "http://test.com");
    await createBlog(page, "Top Blog", "Author", "http://test.com");

    const topBlog = page.locator(".blog").filter({ hasText: "Top Blog" });
    await topBlog.getByRole("button", { name: "view" }).click();

    for (let i = 0; i < 2; i++) {
      await topBlog.getByRole("button", { name: "like" }).click();
      await expect(topBlog.getByTestId("likes")).toContainText(`likes ${i + 1}`);

    }

    const blogs = page.locator(".blog");

    await expect(blogs.first()).toContainText("Top Blog");
    await expect(blogs.last()).toContainText("Middle Blog");
  });
});
