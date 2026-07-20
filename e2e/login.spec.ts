import { test, expect } from '@playwright/test'

test('should login as admin and redirect to admin panel', async ({ page }) => {
  await page.goto('/login')
  await page.fill('input[type="email"]', 'zero@hospitofind.com')
  await page.fill('input[type="password"]', '1234567')
  await page.click('button[type="submit"]')

  await page.waitForURL(/\/admin/, { timeout: 15000 })
  // The admin dashboard heading
  await expect(page.getByText('Hospital Directory')).toBeVisible()
})
