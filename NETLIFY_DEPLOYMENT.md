# TalhaVerse - Netlify Deployment Guide

## ⚠️ Important: Two-Part Deployment

TalhaVerse requires **TWO separate deployments**:
1. **Frontend** → Netlify (or Vercel)
2. **Backend** → Railway, Render, or Heroku

You **cannot** deploy the full-stack app to Netlify alone because Netlify only hosts static sites, not Node.js backends.

---

## 📦 Option 1: Netlify (Frontend) + Railway (Backend) - RECOMMENDED

### Part A: Deploy Backend to Railway

1. **Go to Railway**: https://railway.app
2. **Sign up** with GitHub
3. **New Project** → **Deploy from GitHub repo**
4. **Select your repository**
5. **Configure**:
   - Root Directory: `backend`
   - Start Command: `npm start`
   - Build Command: `npm install`

6. **Add Environment Variables** in Railway:
   ```
   PORT=5000
   MONGO_URI=<your-mongodb-atlas-uri>
   JWT_SECRET=<your-secret>
   JWT_REFRESH_SECRET=<your-refresh-secret>
   ADMIN_EMAIL=admin@talhaverse.com
   ADMIN_PASSWORD=Admin123!
   NODE_ENV=production
   UPLOAD_DIR=uploads
   MAX_FILE_SIZE=524288000
   FRONTEND_URL=<your-netlify-url>
   ```

7. **Get your Railway URL** (e.g., `https://talhaverse-backend.up.railway.app`)

8. **Run seed command** in Railway terminal:
   ```bash
   npm run seed
   ```

### Part B: Deploy Frontend to Netlify

1. **Update Frontend API URL**:
   - Edit `frontend/.env`:
   ```
   VITE_API_URL=https://your-railway-backend-url.up.railway.app/api
   ```

2. **Rebuild Frontend**:
   ```bash
   cd frontend
   npm run build
   ```

3. **Deploy to Netlify**:

   **Method 1: Drag & Drop (Easiest)**
   - Go to https://app.netlify.com
   - Drag the `frontend/dist` folder to Netlify
   - Done! ✅

   **Method 2: GitHub Integration**
   - Push your code to GitHub
   - Go to Netlify → New Site from Git
   - Connect GitHub repository
   - Configure:
     - Base directory: `frontend`
     - Build command: `npm run build`
     - Publish directory: `frontend/dist`
   - Add environment variable:
     - `VITE_API_URL` = `https://your-railway-backend-url.up.railway.app/api`
   - Deploy!

4. **Get your Netlify URL** (e.g., `https://talhaverse.netlify.app`)

5. **Update Backend CORS**:
   - Go back to Railway
   - Update `FRONTEND_URL` environment variable to your Netlify URL
   - Redeploy backend

---

## 📦 Option 2: Vercel (Frontend) + Render (Backend)

### Part A: Deploy Backend to Render

1. **Go to Render**: https://render.com
2. **Sign up** with GitHub
3. **New** → **Web Service**
4. **Connect repository**
5. **Configure**:
   - Name: `talhaverse-backend`
   - Root Directory: `backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`

6. **Add Environment Variables** (same as Railway above)

7. **Get your Render URL** (e.g., `https://talhaverse-backend.onrender.com`)

### Part B: Deploy Frontend to Vercel

1. **Update Frontend API URL** in `frontend/.env`

2. **Deploy to Vercel**:
   - Go to https://vercel.com
   - Import Git Repository
   - Configure:
     - Framework Preset: `Vite`
     - Root Directory: `frontend`
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - Add environment variable:
     - `VITE_API_URL` = `https://your-render-backend-url.onrender.com/api`
   - Deploy!

---

## 🗄️ MongoDB Setup (Required for Both Options)

You need MongoDB Atlas (free tier available):

1. **Go to**: https://www.mongodb.com/cloud/atlas
2. **Create free cluster**
3. **Database Access** → Create user
4. **Network Access** → Add IP: `0.0.0.0/0` (allow all)
5. **Connect** → Get connection string
6. **Copy connection string** and use it as `MONGO_URI` in backend environment variables

---

## 📁 What to Upload Where

### For Netlify (Frontend Only):
- **Folder**: `frontend/dist` (after running `npm run build`)
- **OR** connect GitHub and set base directory to `frontend`

### For Railway/Render (Backend Only):
- **Folder**: `backend` (entire folder)
- **OR** connect GitHub and set root directory to `backend`

---

## ⚡ Quick Deployment Checklist

### Backend (Railway/Render):
- [ ] Create account
- [ ] Deploy backend folder
- [ ] Add all environment variables
- [ ] Use MongoDB Atlas connection string
- [ ] Run seed command to create admin user
- [ ] Copy backend URL

### Frontend (Netlify/Vercel):
- [ ] Update `VITE_API_URL` in frontend/.env with backend URL
- [ ] Run `npm run build` in frontend folder
- [ ] Deploy `frontend/dist` folder to Netlify
- [ ] OR connect GitHub repository
- [ ] Copy frontend URL

### Final Steps:
- [ ] Update backend `FRONTEND_URL` with frontend URL
- [ ] Test login at your frontend URL
- [ ] Test admin panel
- [ ] Test file upload
- [ ] Test download

---

## 🔧 Important Notes

1. **Free Tier Limitations**:
   - Railway: $5 free credit/month
   - Render: Free tier sleeps after 15 min inactivity (slow first load)
   - Netlify: 100GB bandwidth/month free
   - MongoDB Atlas: 512MB storage free

2. **File Uploads**:
   - Railway/Render have limited storage
   - For production, use AWS S3 (see DEPLOYMENT.md)

3. **Environment Variables**:
   - Never commit `.env` files
   - Always use platform environment variable settings

4. **Custom Domain** (Optional):
   - Buy domain from Namecheap/GoDaddy
   - Add to Netlify: Domain Settings → Add custom domain
   - Update DNS records as instructed

---

## 🚨 Common Issues

### Issue: "Network Error" in frontend
**Solution**: Check `VITE_API_URL` is correct and backend is running

### Issue: "CORS Error"
**Solution**: Update `FRONTEND_URL` in backend environment variables

### Issue: "Cannot connect to MongoDB"
**Solution**: Check MongoDB Atlas IP whitelist includes `0.0.0.0/0`

### Issue: Images not loading
**Solution**: Backend must be deployed for file uploads to work

---

## 💰 Cost Estimate

### Free Tier (Good for testing):
- Frontend: Netlify Free
- Backend: Railway $5 credit or Render Free
- Database: MongoDB Atlas Free
- **Total**: $0-5/month

### Production (Recommended):
- Frontend: Netlify Pro ($19/month) or Vercel Pro ($20/month)
- Backend: Railway Hobby ($5/month) or Render Starter ($7/month)
- Database: MongoDB Atlas Shared ($9/month)
- Storage: AWS S3 (~$5/month)
- **Total**: ~$40-60/month

---

## 📞 Need Help?

Check these resources:
- Railway Docs: https://docs.railway.app
- Render Docs: https://render.com/docs
- Netlify Docs: https://docs.netlify.com
- MongoDB Atlas: https://docs.atlas.mongodb.com

---

## ✅ Success!

Once deployed, your TalhaVerse will be live at:
- **Frontend**: `https://your-site.netlify.app`
- **Backend API**: `https://your-backend.up.railway.app/api`

Share your gaming content with the world! 🎮🚀
