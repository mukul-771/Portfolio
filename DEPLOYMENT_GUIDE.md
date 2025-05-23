# Deployment Guide

This guide will help you deploy your portfolio website to free hosting platforms and set up automatic deployments.

## 📋 Prerequisites

1. **GitHub Account**: Create one at [github.com](https://github.com)
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com) (use GitHub login)
3. **Railway Account**: Sign up at [railway.app](https://railway.app) (use GitHub login)

## 🚀 Step 1: Upload to GitHub

### Create GitHub Repository
1. Go to [github.com](https://github.com) and click "New repository"
2. Repository name: `portfolio-website` (or any name you prefer)
3. Description: "Modern portfolio website with MERN stack and admin dashboard"
4. Set to **Public** (required for free hosting)
5. **Don't** initialize with README (we already have one)
6. Click "Create repository"

### Push Your Code
```bash
# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/portfolio-website.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## 🖥️ Step 2: Deploy Backend (Railway)

### Setup Railway
1. Go to [railway.app](https://railway.app)
2. Click "Login" and use GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your portfolio repository
5. Railway will detect it's a Node.js project

### Configure Backend Deployment
1. **Root Directory**: Set to `server`
2. **Start Command**: `npm start`
3. **Environment Variables**:
   ```
   PORT=5000
   JWT_SECRET=your_super_secret_jwt_key_here
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   NODE_ENV=production
   ```

### Get Backend URL
- After deployment, Railway will give you a URL like: `https://your-app-name.railway.app`
- **Save this URL** - you'll need it for frontend configuration

## 🌐 Step 3: Deploy Frontend (Vercel)

### Setup Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Login" and use GitHub
3. Click "New Project"
4. Import your GitHub repository

### Configure Frontend Deployment
1. **Framework Preset**: Vite
2. **Root Directory**: `client`
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. **Install Command**: `npm install`

### Environment Variables
Add these in Vercel dashboard:
```
VITE_API_URL=https://your-railway-app.railway.app
```

### Update API Configuration
Before deploying, update your frontend API configuration:

1. Open `client/src/services/jsonApi.ts`
2. Update the base URL:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

## 🔧 Step 4: Final Configuration

### Update CORS Settings
In your `server/server.js`, update CORS to allow your Vercel domain:
```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-vercel-app.vercel.app'
  ],
  credentials: true
}));
```

### Test Your Deployment
1. **Frontend**: Visit your Vercel URL
2. **Backend**: Test API endpoints
3. **Admin Panel**: Go to `/admin` and login
4. **Add Project**: Test the full workflow

## 🎯 Step 5: Custom Domain (Optional)

### Vercel Custom Domain
1. Go to your Vercel project dashboard
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

### Update Backend CORS
Add your custom domain to the CORS origins list.

## 🔄 Automatic Deployments

Both platforms will automatically deploy when you push to GitHub:

### For Updates
```bash
# Make your changes
git add .
git commit -m "Update: description of changes"
git push origin main
```

- **Railway**: Automatically redeploys backend
- **Vercel**: Automatically redeploys frontend

## 🛠️ Troubleshooting

### Common Issues

1. **Build Fails**: Check Node.js version compatibility
2. **API Not Working**: Verify environment variables
3. **Images Not Loading**: Check file upload paths
4. **Admin Login Fails**: Verify JWT_SECRET is set

### Debugging Steps
1. Check deployment logs in Railway/Vercel dashboards
2. Test API endpoints directly
3. Verify environment variables are set correctly
4. Check CORS configuration

## 📱 Adding Projects After Deployment

1. Visit your deployed website
2. Go to `/admin`
3. Login with your credentials
4. Add/edit projects as needed
5. Changes appear immediately on the live site

## 💰 Cost Breakdown

- **GitHub**: Free for public repositories
- **Railway**: 500 hours/month free (enough for personal portfolio)
- **Vercel**: Unlimited for personal projects
- **Custom Domain**: ~$10-15/year (optional)

**Total Monthly Cost: $0** 🎉

## 🔐 Security Notes

- Never commit `.env` files to GitHub
- Use strong JWT secrets
- Keep admin credentials secure
- Regularly update dependencies

## 📞 Support

If you encounter issues:
1. Check the deployment logs
2. Verify all environment variables
3. Test locally first
4. Check CORS configuration

Your portfolio is now ready for the world! 🚀
