import { test, expect } from '@playwright/test'

test('should search for hospitals and see results', async ({ page }) => {
  await page.goto('/find-hospital')

  await page.fill('input[placeholder*="Search"]', 'Lagos')
  await page.click('button:has-text("Search")')

  // Wait for the results heading to appear (e.g., "18 facilities in Lagos")
  await expect(page.locator('h2:has-text("facilities in")')).toBeVisible({
    timeout: 10000,
  })

  // Verify at least one result card (article) is visible
  const cards = page.locator('article')
  await expect(cards.first()).toBeVisible()
})
