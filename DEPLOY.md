# Deployment Instructions

Your InvestNaira platform is ready for deployment! Follow these steps to go live.

## 1. Backend (Render.com)

1.  **Create a New Web Service** on [Render](https://dashboard.render.com/).
2.  **Connect your GitHub repository**.
3.  **Settings**:
    *   **Root Directory**: Leave empty (defaults to project root).
    *   **Runtime**: Python 3.
    *   **Build Command**: `./build.sh`
    *   **Start Command**: `gunicorn investnaira.wsgi:application`
4.  **Environment Variables**:
    *   `PYTHON_VERSION`: `3.9.0` (or matching your local version)
    *   `SECRET_KEY`: (Generate a strong random string)
    *   `DEBUG`: `False`
    *   `DATABASE_URL`: (Render creates a PostgreSQL DB for you, or use an external one. If using Render's PostgreSQL, link it in the dashboard).
    *   `ALLOWED_HOSTS`: `*` (or your specific Render URL)
    *   `OPENAI_API_KEY`: (Your OpenAI Key for the AI Advisor)
    *   `DISABLE_COLLECTSTATIC`: `0`

## 2. Frontend (Vercel)

1.  **Import Project** on [Vercel](https://vercel.com/new).
2.  **Select your GitHub repository**.
3.  **Configure Project**:
    *   **Root Directory**: Click "Edit" and select `investnaira-frontend-main`.
    *   **Framework Preset**: Next.js (should detect automatically).
4.  **Environment Variables**:
    *   `NEXT_PUBLIC_API_URL`: The URL of your deployed Render backend (e.g., `https://investnaira-backend.onrender.com`). **Important:** No trailing slash.
5.  **Deploy**.

## 3. Post-Deployment

*   **Create Admin User**: In Render's "Shell" tab, run:
    ```bash
    python manage.py createsuperuser
    ```
*   **Seed Data** (Optional):
    ```bash
    python manage.py seed_premium_data
    ```

Your InvestNaira platform is now live! 🚀
