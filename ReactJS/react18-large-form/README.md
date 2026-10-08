# React 18 Large Form Demo

Enterprise-style form example using:

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Hook Form
- Zod validation
- 20+ fields
- Reusable Field and Section components
- Conditional rendering
- Validation/error handling
- Submit loading state
- Reset functionality
- Form state/error summary

## Requirements

Node.js 18+ recommended. Node.js 20+ is preferred.

## Run locally

```bash
npm install
npm run dev
```

Open the URL printed by Vite, usually:

http://localhost:5173

## Production build

```bash
npm run build
npm run preview
```

## Interview concepts demonstrated

1. Avoid 20+ individual useState variables.
2. React Hook Form manages form state efficiently.
3. Zod centralizes validation rules.
4. Reusable Field/Section components reduce duplication.
5. useWatch handles dependent/conditional fields.
6. Submit happens through one controlled handler.
7. Loading and validation states are handled at form level.

## Enterprise extensions

For a real production application, this can be extended with:

- React Router
- Redux Toolkit for cross-page/global state
- API service layer using Axios/fetch
- Server-side validation
- Authentication/JWT
- Multi-step wizard
- File uploads
- Dynamic field arrays
- Draft/autosave
- Backend Spring Boot/Node/Django API
- Unit tests with Vitest/React Testing Library
