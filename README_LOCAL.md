# How to Run InvestNaira Locally

## Prerequisites
- **Python 3.9+** (for Django)
- **Node.js** (Provided locally in `.node_dist`, no global install needed)

## Quick Start
The project requires **two terminal windows** running simultaneously.

### Terminal 1: Backend (Django)
Run this from the `INCodex` directory:
```bash
# Activate virtualenv if you use one, otherwise just:
python3 manage.py runserver 0.0.0.0:8000
```
Server will be at: [http://localhost:8000](http://localhost:8000)

### Terminal 2: Frontend (Next.js)
Run this from the `INCodex` directory:
```bash
# 1. Setup local Node.js path (IMPORTANT)
export PATH=$PWD/.node_dist/bin:$PATH

# 2. Go to frontend dir and run
cd investnaira-frontend-main
npm run dev
```
Server will be at: [http://localhost:3000](http://localhost:3000)

## Troubleshooting
- **Database**: The app uses `db.sqlite3`. If you face migration errors, delete it and run `python3 manage.py migrate`.
- **Node Not Found**: Ensure you ran the `export PATH=...` command in the frontend terminal.
