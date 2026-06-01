# HospitoFind Frontend – Development Documentation

## 1. Overview

The HospitoFind frontend is a React single‑page application that provides the user interface for the hospital discovery platform. It communicates with the Node.js backend API and handles all client‑side logic including authentication, hospital search, AI chat, and admin tools.

## 2. Architecture

### Tech Stack

| Layer           | Technology                            |
|-----------------|---------------------------------------|
| Framework       | React 18 (with hooks & context)       |
| Language        | TypeScript                            |
| Build Tool      | Vite                                  |
| Routing         | React Router v6                       |
| Styling         | SCSS Modules                          |
| HTTP Client     | Axios (with interceptors)             |
| Authentication  | Auth0 (social) + local JWT            |
| Maps            | Mapbox GL JS                          |
| State Management| React Context + useReducer            |
| PWA             | Service worker + web manifest         |

### Folder Structure

```
src/
 ├── assets/            (images, fonts, icons)
 ├── components/        (reusable UI components)
 ├── context/           (React context providers)
 ├── hooks/             (custom hooks)
 ├── layouts/           (page layout components)
 ├── pages/             (route‑level page components)
 ├── services/          (API client and helper functions)
 ├── styles/            (global styles, variables, mixins)
 └── types/             (TypeScript type definitions)
```

### Key Libraries

- **Axios** – HTTP requests to the backend API, with request/response interceptors for authentication and loading state.
- **Auth0 React SDK** – social login integration.
- **React Router** – client‑side routing with lazy‑loaded route components.
- **React Toastify** – toast notifications for user feedback.
- **Lucide React / React Icons** – icon sets used throughout the UI.

## 3. Key Design Decisions

### 3.1 API Layer

All backend API calls use a central Axios instance configured with `baseURL = /api/v1`. Authentication tokens are attached automatically via interceptors, and a global loading spinner is shown for non‑agent requests.

### 3.2 Authentication Flow

- **Local login** – email/password → JWT stored in localStorage; refresh token in HTTP‑only cookie.
- **Social login** – Auth0 redirect → callback page sends ID token to backend → backend exchanges for JWT.
- **Persisted login** – on page load, a silent refresh is attempted with the cookie; if successful, the session is restored.

### 3.3 State Management

React Context is used for global state (auth, theme). Page‑level state is managed with hooks and local state. No external state management library is needed at the current scale.

### 3.4 Theming

A dark/light theme toggle is implemented using CSS custom properties and a `data-theme` attribute on the root element. Theme preference is persisted in localStorage.

### 3.5 PWA

The app is installable on mobile and desktop via a web manifest and a minimal service worker. No offline caching strategy is currently implemented.

## 4. Data Flow

1. **Public routes** – fetch hospital data directly from the API on mount.
2. **Protected routes** – require a valid access token; an Axios interceptor handles automatic token refresh on 401 responses.
3. **Admin routes** – additionally check for `admin` role; unauthorized access redirects to `/unauthorized`.
4. **Agent chat** – sends user messages to the AI chat endpoint; the response may trigger a hospital match or continue the conversation.

## 5. Testing

There are currently no automated frontend tests. Smoke tests for critical user flows (login, search, admin approval) are planned. See `ROADMAP.md` for details.

## 6. Deployment

- **Hosting**: Vercel (with automatic preview deployments for branches).
- **Build command**: `npm run build` (Vite).
- **Environment variables**: `VITE_BASE_URL` (backend API URL), Auth0 credentials.
- **PWA**: The service worker and manifest are served from the `public/` directory.
