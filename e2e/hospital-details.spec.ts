import { test, expect } from '@playwright/test'

test('should display hospital details correctly', async ({ page }) => {
  await page.goto(
    '/hospital/location/Lagos/lagos-state-university-teaching-hospital-lsuth'
  )

  // Check the hospital name is visible
  await expect(page.locator('h1').first()).toContainText(
    'Lagos State University Teaching Hospital'
  )

  // Check location info is visible
  await expect(page.locator('text=Oba Akinjobi Road').first()).toBeVisible()

  // Check phone number is visible
  await expect(page.locator('text=+234-909-148-1560').first()).toBeVisible()

  // Check "Verified Facility" badge is visible
  await expect(page.locator('text=Verified Facility').first()).toBeVisible()
})
