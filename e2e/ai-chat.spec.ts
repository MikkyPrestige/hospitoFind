import { test, expect } from '@playwright/test'

test('should send a message and receive a response in the AI chat', async ({
  page,
}) => {
  await page.goto('/')

  // The chat widget is already visible on the homepage
  const chatInput = page.locator('._input_mf7um_377')
  await expect(chatInput).toBeVisible({ timeout: 10000 })

  // Intercept the agent/chat API call and return a fake response
  await page.route('**/agent/chat', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        type: 'MESSAGE',
        message: 'This is a test response from the AI assistant.',
      }),
    })
  })

  // Type a message
  await chatInput.fill('I have a headache')

  // Wait for the send button to become enabled and click it
  const sendButton = page.locator('._sendBtn_mf7um_409')
  await expect(sendButton).not.toBeDisabled({ timeout: 5000 })
  await sendButton.click()

  // Verify the assistant's response bubble appears
  const assistantBubble = page.locator('._bubbleContent_mf7um_243', {
    hasText: 'This is a test response',
  })
  await expect(assistantBubble).toBeVisible({ timeout: 10000 })
})
