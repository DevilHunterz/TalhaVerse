# 🚀 TalhaVerse Deployment Guide - Netlify + Railway

## Quick Overview
- **Frontend** → Netlify (Free)
- **Backend** → Railway (Free $5 credit)
- **Database** → MongoDB Atlas (Free)

---

## 📋 Prerequisites

1. GitHub account
2. Netlify account (https://netlify.com)
3. Railway account (https://railway.app)
4. MongoDB Atlas account (https://mongodb.com/cloud/atlas)

---

## Step 1: Setup MongoDB Atlas (5 minutes)

1. Go to https://mongodb.com/cloud/atlas
2. Click **"Try Free"** and sign up
3. Create a **FREE cluster**:
   - Choose **M0 Sandbox** (Free tier)
   - Select region closest to you
   - Click **"Create Cluster"**

4. **Create Database User**:
   - Go to **Database Access** → **Add New Database User**
   - Username: `talhaverse`
   - Password: Generate a strong password (save it!)
   - Database User Privileges: **Read and write to any database**
   - Click **"Add User"**

5. **Whitelist IP Address**:
   - Go to **Network Access** → **Add IP Address**
   - Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - Click **"Confirm"**

6. **Get Connection String**:
   - Go to **Database** → Click **"Connect"**
   - Choose **"Connect your application"**
   - Copy the connection string (looks like):
   ```
   mongodb+srv://talhaverse:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   - Replace `<password>` with your actual password
   - Save this connection string!

---

## Step 2: Deploy Backend to Railway (10 minutes)

### 2.1 Push Code to GitHub

```bash
# Initialize git (if not already)
git init
git add .
git commit -m "Initial commit"

# Create GitHub repo and push
git remote add origin https://github.com/YOUR_USERNAME/talhaverse.git
git branch -M main
git push -u origin main
```

### 2.2 Deploy to Railway

1. Go to https://railway.app
2. Click **"Start a New Project"**
3. Click **"Deploy from GitHub repo"**
4. **Authorize Railway** to access your GitHub
5. **Select your repository** (talhaverse)
6. Railway will detect it's a Node.js project

### 2.3 Configure Railway

1. Click on your project
2. Click **"Variables"** tab
3. Add these environment variables:

```
PORT=5000
MONGO_URI=mongodb+srv://talhaverse:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/talhaverse?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_this_in_production_67890
ADMIN_EMAIL=admin@talhaverse.com
ADMIN_PASSWORD=Admin123!
NODE_ENV=production
UPLOAD_DIR=uploads
MAX_FILE_SIZE=524288000
FRONTEND_URL=https://your-site-name.netlify.app
```

**Important**: 
- Replace `YOUR_PASSWORD` with your MongoDB password
- Replace `FRONTEND_URL` with your Netlify URL (we'll get this in Step 3)

4. Click **"Settings"** → **"General"**
5. Set **Root Directory**: `backend`
6. Set **Start Command**: `npm start`
7. Set **Build Command**: `npm install`

### 2.4 Deploy and Get URL

1. Click **"Deploy"**
2. Wait for deployment (2-3 minutes)
3. Once deployed, click **"Settings"** → **"Domains"**
4. Copy your Railway URL (e.g., `https://talhaverse-production.up.railway.app`)
5. **Save this URL!**

### 2.5 Seed Admin User

1. In Railway dashboard, click **"Settings"** → **"Service"**
2. Scroll to **"Custom Start Command"**
3. Temporarily change to: `npm run seed && npm start`
4. Click **"Redeploy"**
5. Wait for deployment
6. Change back to: `npm start`
7. Click **"Redeploy"** again

**OR** use Railway CLI:
```bash
railway run npm run seed
```

---

## Step 3: Deploy Frontend to Netlify (5 minutes)

### 3.1 Update Frontend API URL

1. Edit `frontend/.env`:
```
VITE_API_URL=https://your-railway-url.up.railway.app/api
```

Replace with your actual Railway URL from Step 2.4

2. Rebuild frontend:
```bash
cd frontend
npm run build
```

### 3.2 Deploy to Netlify

**Method A: Drag & Drop (Easiest)**

1. Go to https://app.netlify.com
2. Click **"Add new site"** → **"Deploy manually"**
3. Drag the `frontend/dist` folder to the upload area
4. Wait for deployment (1 minute)
5. Done! ✅

**Method B: GitHub Integration (Recommended)**

1. Go to https://app.netlify.com
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **"Deploy with GitHub"**
4. **Authorize Netlify** to access GitHub
5. **Select your repository**
6. Configure build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
7. Click **"Show advanced"** → **"New variable"**
8. Add environment variable:
   - Key: `VITE_API_URL`
   - Value: `https://your-railway-url.up.railway.app/api`
9. Click **"Deploy site"**

### 3.3 Get Netlify URL

1. Once deployed, copy your Netlify URL (e.g., `https://talhaverse.netlify.app`)
2. You can customize it: **Site settings** → **Change site name**

### 3.4 Update Backend CORS

1. Go back to **Railway dashboard**
2. Click **"Variables"**
3. Update `FRONTEND_URL` to your Netlify URL
4. Click **"Redeploy"**

---

## Step 4: Test Your Deployment ✅

1. **Open your Netlify URL** in browser
2. **Test Login**:
   - Email: `admin@talhaverse.com`
   - Password: `Admin123!`
3. **Test Admin Panel**:
   - Click "Admin" in navbar
   - Try uploading a mod
4. **Test Download**:
   - Go to home page
   - Click on uploaded mod
   - Test download button

---

## 🎉 You're Live!

Your TalhaVerse is now online at:
- **Frontend**: https://your-site.netlify.app
- **Backend**: https://your-backend.up.railway.app
- **Admin Login**: https://your-site.netlify.app/login

---

## 🔧 Troubleshooting

### Issue: "Network Error" in frontend
**Solution**: Check `VITE_API_URL` in Netlify environment variables

### Issue: "CORS Error"
**Solution**: Update `FRONTEND_URL` in Railway to match your Netlify URL

### Issue: "Cannot connect to MongoDB"
**Solution**: 
- Check MongoDB Atlas IP whitelist (should be 0.0.0.0/0)
- Verify connection string in Railway variables

### Issue: Images not loading
**Solution**: 
- Images are stored on Railway server
- For production, consider using Cloudinary (see below)

### Issue: Railway app sleeping
**Solution**: 
- Free tier sleeps after 15 min inactivity
- Upgrade to Hobby plan ($5/month) for always-on

---

## 💡 Optional: Use Cloudinary for Images

For better performance, use Cloudinary for image hosting:

1. Sign up at https://cloudinary.com (free tier)
2. Get your credentials from dashboard
3. Add to Railway variables:
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
4. Update upload code to use Cloudinary SDK

---

## 📊 Monitoring

### Railway Dashboard
- View logs: Click on deployment → "View Logs"
- Monitor usage: "Metrics" tab
- Check health: "Deployments" tab

### Netlify Dashboard
- View deploy logs: "Deploys" tab
- Check analytics: "Analytics" tab
- Monitor bandwidth: "Usage" tab

---

## 🔄 Updating Your Site

### Update Frontend
```bash
cd frontend
# Make changes
npm run build
git add .
git commit -m "Update frontend"
git push
```
Netlify will auto-deploy!

### Update Backend
```bash
cd backend
# Make changes
git add .
git commit -m "Update backend"
git push
```
Railway will auto-deploy!

---

## 💰 Cost Breakdown

### Free Tier (Good for 1-2 months):
- Netlify: Free (100GB bandwidth)
- Railway: $5 credit (lasts ~1-2 months)
- MongoDB Atlas: Free (512MB storage)
- **Total**: $0

### Production (Recommended):
- Netlify Pro: $19/month
- Railway Hobby: $5/month
- MongoDB Atlas Shared: $9/month
- Cloudinary: Free tier or $0.04/GB
- **Total**: ~$35/month

---

## 🎯 Next Steps

1. ✅ Custom domain (buy from Namecheap)
2. ✅ SSL certificate (automatic on Netlify)
3. ✅ Email notifications (add Nodemailer)
4. ✅ Analytics (Google Analytics)
5. ✅ SEO optimization
6. ✅ Social media integration

---

## 📞 Support

- Railway Docs: https://docs.railway.app
- Netlify Docs: https://docs.netlify.com
- MongoDB Atlas: https://docs.atlas.mongodb.com

---

## ✅ Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] IP whitelist configured (0.0.0.0/0)
- [ ] Connection string copied
- [ ] Code pushed to GitHub
- [ ] Railway project created
- [ ] Backend environment variables added
- [ ] Backend deployed successfully
- [ ] Admin user seeded
- [ ] Railway URL copied
- [ ] Frontend .env updated with Railway URL
- [ ] Frontend built (npm run build)
- [ ] Netlify site created
- [ ] Frontend deployed
- [ ] Netlify URL copied
- [ ] Backend FRONTEND_URL updated
- [ ] Backend redeployed
- [ ] Login tested
- [ ] Admin panel tested
- [ ] Upload tested
- [ ] Download tested

---

**Congratulations! Your TalhaVerse is now live! 🎮🚀**
