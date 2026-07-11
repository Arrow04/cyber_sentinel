# Product Showcase Website

A modern product showcase website built with:
- **Next.js + React + Tailwind CSS** frontend
- **FastAPI** backend
- **PostgreSQL** database

## Structure
- `frontend/`: Next.js app with dark-themed landing page
- `backend/`: FastAPI API for product CRUD
- `db/`: PostgreSQL schema definitions

## Local Setup
### Frontend
```powershell
cd frontend
npm install
npm run dev
```
### Backend
```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```
### Admin
Set `ADMIN_API_KEY` in `backend/.env` (default: `changeme`).
Open `http://localhost:3000/admin`, enter the admin API key and manage products.

## Deployment
- Frontend: **Vercel**
- Backend: **Railway** or **Render**
- Database: **Supabase**

> Use `DATABASE_URL` in `backend/.env` to connect the FastAPI backend to PostgreSQL.
