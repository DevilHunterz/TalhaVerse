# TalhaVerse Setup Guide

Complete step-by-step guide to set up and run TalhaVerse locally.

## Prerequisites

- Node.js 18+ and npm
- MongoDB (local installation or MongoDB Atlas account)
- Git

## Step 1: Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd talhaverse

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

## Step 2: Configure Environment Variables

### Backend Configuration

Create `backend/.env` file:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/talhaverse
JWT_SECRET=your_super_secret_jwt_key_here_change_this
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here_change_this
ADMIN_EMAIL=admin@talhaverse.com
ADMIN_PASSWORD=Admin123!
NODE_ENV=development
UPLOAD_DIR=uploads
MAX_FILE_SIZE=524288000

# Optional: AWS S3 (for production)
AWS_S3_BUCKET=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
```

**Important:** Replace the following placeholders:
- `MONGO_URI`: Your MongoDB connection string
- `JWT_SECRET`: Generate a strong random string (32+ characters)
- `JWT_REFRESH_SECRET`: Generate another strong random string
- `ADMIN_EMAIL`: Your admin email address
- `ADMIN_PASSWORD`: Your admin password (min 6 characters)

### Frontend Configuration

Create `frontend/.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

## Step 3: Start MongoDB

### Option A: Local MongoDB
```bash
# Start MongoDB service
# Windows:
net start MongoDB

# macOS (Homebrew):
brew services start mongodb-community

# Linux:
sudo systemctl start mongod
```

### Option B: MongoDB Atlas
1. Create a free cluster at https://www.mongodb.com/cloud/atlas
2. Get your connection string
3. Update `MONGO_URI` in `backend/.env`

## Step 4: Seed Admin User

```bash
cd backend
npm run seed
```

You should see:
```
✅ Connected to MongoDB
✅ Admin user created successfully
   Email: admin@talhaverse.com
   Role: admin
```

## Step 5: Start the Application

### Terminal 1 - Backend
```bash
cd backend
npm start
# Or for development with auto-reload:
npm run dev
```

You should see:
```
✅ Connected to MongoDB
🚀 Server running on port 5000
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

## Step 6: Access the Application

1. **Frontend**: Open http://localhost:5173
2. **Backend API**: http://localhost:5000/api
3. **Health Check**: http://localhost:5000/api/health

## Step 7: Login as Admin

1. Go to http://localhost:5173/login
2. Enter your admin credentials:
   - Email: (from your `.env` ADMIN_EMAIL)
   - Password: (from your `.env` ADMIN_PASSWORD)
3. You should be redirected to the home page
4. Click "Admin" in the navigation to access the admin panel

## Step 8: Upload Test Content

1. Navigate to Admin Panel → Upload Content
2. Fill in the form:
   - Title: "Test Mod"
   - Type: Mod
   - Version: 1.0.0
   - Game Version: 1.20.1
   - Author: Your name
   - Short Description: "A test mod"
   - Full Description: "This is a test mod for TalhaVerse"
3. Upload files:
   - Thumbnail: Any image file
   - Content File: Any .zip file
4. Click "Upload Content"
5. Check the home page to see your uploaded content

## Verification Checklist

- [ ] Backend server running on port 5000
- [ ] Frontend dev server running on port 5173
- [ ] MongoDB connected successfully
- [ ] Admin user created via seed script
- [ ] Can login with admin credentials
- [ ] Can access admin panel
- [ ] Can upload test content
- [ ] Can view uploaded content on home page
- [ ] Can download uploaded content
- [ ] Download counter increments

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Make sure MongoDB is running. Check with:
```bash
# Windows
sc query MongoDB

# macOS/Linux
ps aux | grep mongod
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: Change the PORT in `backend/.env` or kill the process using that port.

### Admin Seed Already Exists
```
⚠️  Admin user already exists
```
**Solution**: This is normal if you've already run the seed script. The admin user is already created.

### CORS Error in Browser
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution**: Make sure backend is running and `VITE_API_URL` in frontend `.env` is correct.

### File Upload Error
```
Error: ENOENT: no such file or directory
```
**Solution**: The uploads directory will be created automatically. If issues persist, manually create `backend/uploads` folder.

## Docker Setup (Optional)

If you prefer using Docker:

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

Services will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- MongoDB: localhost:27017

## Production Deployment

### Environment Variables for Production

Update these in your production environment:

```env
NODE_ENV=production
MONGO_URI=<your-production-mongodb-uri>
JWT_SECRET=<strong-random-secret>
JWT_REFRESH_SECRET=<strong-random-secret>
FRONTEND_URL=https://yourdomain.com

# AWS S3 for file storage
AWS_S3_BUCKET=your-bucket-name
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
```

### Build Frontend

```bash
cd frontend
npm run build
```

The `dist/` folder contains the production build. Serve it with nginx, Vercel, or any static hosting.

### Run Backend in Production

```bash
cd backend
npm start
```

Use PM2 for process management:
```bash
npm install -g pm2
pm2 start src/server.js --name talhaverse-backend
pm2 save
pm2 startup
```

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the main README.md
3. Check backend/frontend logs for error messages

## Next Steps

- Customize the theme colors in `frontend/tailwind.config.js`
- Add your own logo
- Configure email service for password reset
- Set up AWS S3 for production file storage
- Add SSL certificate for HTTPS
- Configure domain and DNS
