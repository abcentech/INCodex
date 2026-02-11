# Deployment Instructions

Your InvestNaira platform is ready for deployment! Follow these streamlined steps to go live.

## Prerequisites

- GitHub account with your InvestNaira repository
- Render account (for backend): [render.com](https://render.com)
- Vercel account (for frontend): [vercel.com](https://vercel.com)

## 1. Backend Deployment (Render)

### Option A: Automated Deployment (Recommended)

1. **Push to GitHub** (already done!)
2. **Import from GitHub** on [Render Dashboard](https://dashboard.render.com)
3. **Select** `render.yaml` - Render will automatically configure everything
4. **Add Environment Variables** (Render will prompt you):
   - `OPENAI_API_KEY`: Your OpenAI API key for the AI Advisor
   - `AZURE_ACCOUNT_NAME`: Azure storage account name
   - `AZURE_ACCOUNT_KEY`: Azure storage key
   - `AZURE_CONTAINER`: Azure container name
   - (Other vars like `SECRET_KEY` and `DATABASE_URL` are auto-generated)

### Option B: Manual Setup

1. Create a new **Web Service** on Render
2. Connect your GitHub repository
3. Configure:
   - **Build Command**: `./build.sh`
   - **Start Command**: `gunicorn investnaira.wsgi:application`
4. Add the environment variables listed in Option A

## 2. Frontend Deployment (Vercel)

1. **Import Project** on [Vercel](https://vercel.com/new)
2. **Select your GitHub repository**
3. Vercel will auto-detect Next.js and use the `vercel.json` config
4. **Set Environment Variable**:
   - `NEXT_PUBLIC_API_URL`: Your Render backend URL (e.g., `https://investnaira-backend.onrender.com`)
5. **Deploy**

## 3. Post-Deployment

Once both are deployed:

1. **Create Admin User** (in Render Shell):
   ```bash
   python manage.py createsuperuser
   ```

2. **Seed Data** (Optional):
   ```bash
   python manage.py seed_premium_data
   ```

3. **Test**: Visit your Vercel URL and verify all features work!

## Deployment Status

✅ Backend code pushed to GitHub  
✅ Frontend code pushed to GitHub  
✅ `render.yaml` configured  
✅ `vercel.json` configured  
✅ `build.sh` created  
✅ `Procfile` created  

Your InvestNaira platform is ready to go live! 🚀
