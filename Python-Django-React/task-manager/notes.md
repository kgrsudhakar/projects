python

1. Install uv (if you don't have it yet):

# Windows (PowerShell)
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"

2. Create and activate the virtual environment:

bash
cd backend
uv venv

This creates a .venv folder (note: .venv, not venv). Activate it:

# Windows (Command Prompt)
.venv\Scripts\activate.bat

3. Install dependencies with uv (much faster than pip):

bash
uv pip install -r requirements.txt

4. Continue as before:

bash
python manage.py migrate
python manage.py runserver 8000

Even faster alternative — skip activation entirely:
uv can run commands directly against the venv without activating it:

bash
uv venv
uv pip install -r requirements.txt
uv run python manage.py migrate
uv run python manage.py runserver 8000