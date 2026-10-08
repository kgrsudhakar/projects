# Task Manager — React + Redux Toolkit + Django REST Framework

A full-stack CRUD app for interview/demo purposes:

- **Frontend:** React 18, Redux Toolkit, React-Redux, Axios
- **Backend:** Django 4, Django REST Framework, django-filter, django-cors-headers
- **Database:** SQLite (zero config, file-based — swap for PostgreSQL/MySQL easily)

Features: create/read/update/delete tasks, filter by status & priority, search by title/description, inline status change, edit/delete per task.

```
task-manager-project/
├── backend/         # Django REST API
│   ├── config/       # settings, urls, wsgi/asgi
│   ├── tasks/        # the Task app: models, serializers, views, urls
│   ├── manage.py
│   └── requirements.txt
└── frontend/         # React app
    ├── public/
    └── src/
        ├── api/              # axios config
        ├── app/              # redux store
        ├── features/tasks/   # redux slice (async thunks for API calls)
        └── components/       # TaskForm, TaskList, TaskItem, FilterBar
```

---

## Prerequisites

- Python 3.9+ (3.10/3.11 recommended)
- Node.js 18+ and npm
- (Optional) `virtualenv` — using a virtual environment is strongly recommended

---

## 1. Backend setup (Django REST API)

```bash
cd backend

# create & activate a virtual environment
python3 -m venv venv
source venv/bin/activate        # on Windows: venv\Scripts\activate

# install dependencies
pip install -r requirements.txt

# apply migrations (creates db.sqlite3 with the Task table)
python manage.py migrate

# (optional) create an admin user to use the Django admin UI
python manage.py createsuperuser

# run the API server
python manage.py runserver 8000
```

The API is now running at **http://localhost:8000/api/tasks/**
Django admin (if you created a superuser) is at **http://localhost:8000/admin/**

### API endpoints

| Method | URL                    | Description                          |
|--------|------------------------|---------------------------------------|
| GET    | `/api/tasks/`          | List tasks (supports `?status=`, `?priority=`, `?search=`) |
| POST   | `/api/tasks/`          | Create a task |
| GET    | `/api/tasks/{id}/`     | Retrieve a single task |
| PUT    | `/api/tasks/{id}/`     | Full update |
| PATCH  | `/api/tasks/{id}/`     | Partial update |
| DELETE | `/api/tasks/{id}/`     | Delete a task |

Quick test with curl:
```bash
curl -X POST http://localhost:8000/api/tasks/ \
  -H "Content-Type: application/json" \
  -d '{"title":"Write project README","priority":"high"}'
```

---

## 2. Frontend setup (React)

Open a **second terminal** (keep the Django server running in the first one):

```bash
cd frontend

# install dependencies
npm install

# start the dev server
npm start
```

This opens **http://localhost:3000** in your browser, and the app will talk to the Django API at `http://localhost:8000/api` (configured in `src/api/axiosConfig.js`, overridable via a `REACT_APP_API_URL` env var / `.env.local` file).

---

## 3. Using the app

1. Make sure the Django server (port 8000) and React dev server (port 3000) are both running.
2. Go to `http://localhost:3000`.
3. Add a task with the form at the top.
4. Filter/search using the bar below the form.
5. Change status inline, or click **Edit**/**Delete** on any task card.

---

## Troubleshooting

- **CORS errors in the browser console:** confirm the Django server is running on port 8000 and that `CORS_ALLOWED_ORIGINS` in `backend/config/settings.py` includes `http://localhost:3000`.
- **`ModuleNotFoundError: No module named 'django'`:** you likely forgot to activate the virtual environment (`source venv/bin/activate`) before running `manage.py`.
- **Port already in use:** run on a different port, e.g. `python manage.py runserver 8001` (and update `REACT_APP_API_URL` accordingly), or `npm start -- --port 3001`.
- **Migrations issues:** delete `backend/db.sqlite3` and the contents of `backend/tasks/migrations/` (except `__init__.py`), then re-run `python manage.py makemigrations tasks` and `python manage.py migrate`.

---

## What this project demonstrates (for interview prep)

- React functional components + hooks (`useState`, `useEffect`)
- Redux Toolkit: slices, async thunks, `extraReducers`, normalized state updates
- Axios-based API layer decoupled from components
- Django REST Framework: `ModelViewSet`, `ModelSerializer`, routers, filtering/search/ordering
- Django ORM model design with choices, timestamps
- CORS configuration between a separately-hosted SPA and API
- Clean separation of concerns: `config/` (project) vs `tasks/` (app) in Django; `components/` vs `features/` (state) in React
