# InsureFlow — React 18 + TypeScript + Tailwind CSS + Redux Toolkit

Enterprise-style insurance claims management frontend.

## Features
- Dashboard with claim metrics
- Claims table
- Search and status filtering
- Redux Toolkit centralized state
- Update claim status
- Delete claims
- Customers page
- Settings page
- Responsive Tailwind UI
- TypeScript
- Mock async Redux action infrastructure

## Run
Node 18+ recommended (Node 20/22 ideal).

```bash
npm install
npm run dev
```

Open the Vite URL, normally http://localhost:5173.

## Production
```bash
npm run build
npm run preview
```

## Architecture
`main.tsx` → Redux Provider → `App` → layout/pages → typed Redux hooks → slices.

Shared server/domain state belongs in Redux Toolkit. Local UI state such as search/filter/navigation remains in components. For a real backend, connect `createAsyncThunk` to REST APIs and add authentication, RTK Query, server-side pagination/filtering/sorting, error handling, and tests.
