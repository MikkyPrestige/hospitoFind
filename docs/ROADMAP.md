# Frontend Roadmap – Future Improvements

This document lists planned improvements for the HospitoFind frontend.

## Testing

- **Smoke tests (Playwright/Cypress)** – cover login, hospital search, hospital details, and admin approval flows.

## User Experience

- **Offline support via service worker** – cache main pages and API responses for basic offline use.
- **Improved error handling** – replace generic messages with specific user‑friendly error states and error boundaries.
- **Dark mode polish** – audit all components for consistent dark‑mode appearance.
- **Map‑based search with clustering** – display markers for all search results on the “Find hospital” page, with clustering for large result sets.

## Features

- **Hospital reviews / ratings** – allow verified users to leave reviews and ratings (requires backend endpoints).
- **Multi‑language support** – translate UI and support non‑English queries in the AI chat.
- **Saved user preferences** – let users set preferred hospital types, languages, or accessibility needs; auto‑apply in search and matching.
- **Two‑factor authentication (TOTP) setup and management** – enable/configure 2FA for user and admin accounts via Auth0 (requires backend support).

## Admin UI

- **Dashboard charts** – visual insights (hospitals approved per month, users by country, popular search terms). Requires backend aggregation endpoints.
- **OSM import scheduling UI** – expose scheduling controls for automatic OSM imports (if backend adds scheduled imports).
- **Fuzzy duplicate detection UI** – highlight potential duplicates during review with merge options.
- **Batch‑delete selected pending submissions** – extend the existing checkbox system with a “Reject Selected” button and confirmation modal (requires backend endpoint).

## Code Quality

- **Pre‑commit hooks** – add ESLint and Prettier to enforce consistent code style before commits.