# TRACEVIDENCE Backend (Python FastAPI)

This companion microservice provides the Python FastAPI backend implementation for TRACEVIDENCE, pairing with the Next.js frontend.

## Architecture

- **`app/main.py`**: FastAPI app entrypoint with CORS, health check, and analysis routes.
- **`app/models.py`**: SQLAlchemy relational models for Analyses, Claims, Sources, and Evidence snippets.
- **`app/schemas.py`**: Pydantic v2 schemas for structured IO validation and selective prediction definitions.
- **`requirements.txt`**: Standard dependencies (FastAPI, Uvicorn, SQLAlchemy, Pydantic, Alembic).

## Setup & Running

```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

The interactive OpenAPI docs will be available at `http://localhost:8000/docs`.
