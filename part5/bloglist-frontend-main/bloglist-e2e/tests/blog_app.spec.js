import  { test, expect } from '@playwright/test'

test.describe('Blog app', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173')
    })

    test('Login form is shown', async ({page}) => {
        const header = await page.getByText('Log in to application')
        await expect(header).toBeVisible()

        const usernameInput = await page.getByLabel('username')
        const passwordInput = await page.getByLabel('password')
        const loginButton = await page.getByRole('button', { name: /login/i })

        await expect(usernameInput).toBeVisible()
        await expect(passwordInput).toBeVisible()
        await expect(loginButton).toBeVisible()
    })
})