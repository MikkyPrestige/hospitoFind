# HospitoFind Frontend

Frontend web application for HospitoFind; A hospital discovery platform. Built with React and TypeScript, it provides the user interface for hospital search, AI-assisted matching, and administrative tools.

## About

The frontend is a single-page application that communicates with the [HospitoFind Backend API](https://github.com/MikkyPrestige/hospitoFind-server). It handles all client-side logic including user authentication, hospital search, AI chat, and admin dashboard operations.

## Tech Stack

- **React** (with hooks and context)
- **TypeScript**
- **Vite**
- **SCSS Modules**
- **React Router v6**
- **Axios**
- **Auth0** (social login)
- **Mapbox GL JS**

## Features

- AI chat interface for symptom-based hospital matching
- Global hospital directory with search, filters, and location-based queries
- Hospital details with photo, services, hours, and map
- User dashboard with favorites, recently viewed, and health history
- Admin dashboard for managing hospitals, users, symptom mappings, and data imports
- OSM import tool with dry-run preview
- Batch-approve pending submissions
- Dark/light theme toggle
- Progressive Web App (PWA) – installable on mobile and desktop

## Architecture

The application is organised into reusable components, custom hooks, and lazy-loaded pages. API communication is centralised through an Axios instance with automatic token handling and request/response interceptors. Authentication uses local JWT with refresh token support and Auth0 social login.

## Related Repository

- [Backend API](https://github.com/MikkyPrestige/hospitoFind-server)

## Staging

See [docs/STAGING.md](docs/STAGING.md) for details on the staging environment.

---
