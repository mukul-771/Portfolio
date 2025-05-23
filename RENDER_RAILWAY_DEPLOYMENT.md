# 🚀 Render & Railway Deployment Guide

Complete guide for deploying your MERN stack portfolio to Render and Railway platforms.

## 📋 Project Overview

- **Frontend:** React + Vite + TypeScript (client folder)
- **Backend:** Express.js API (server folder)  
- **Database:** JSON file storage (completely free)
- **File Storage:** Local uploads folder

---

## 🎯 Option 1: Render (Recommended)

### **Why Render?**
- ✅ Free tier: 750 hours/month
- ✅ Easy GitHub integration
- ✅ Built-in SSL certificates
- ✅ Supports full-stack apps

### **Step 1: Deploy Backend API**

1. **Go to [Render Dashboard](https://dashboard.render.com)**
2. **Sign up/Login with GitHub**
3. **Click "New +" → "Web Service"**
4. **Connect your GitHub repository**
5. **Configure the service:**
   ```
   Name: mukul-portfolio-api
   Environment: Node
   Region: Oregon (US West)
   Branch: main
   Root Directory: server
   Build Command: npm install
   Start Command: npm start
   ```

6. **Set Environment Variables:**
   ```
   NODE_ENV=production
   PORT=10000
   JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
   EMAIL_USER=mukulmee771@gmail.com
   EMAIL_PASSWORD=your-gmail-app-password
   EMAIL_RECIPIENT=mukulmee771@gmail.com
   ```

7. **Click "Create Web Service"**
8. **Your API will be available at:** `https://mukul-portfolio-api.onrender.com`

### **Step 2: Deploy Frontend**

1. **Click "New +" → "Static Site"**
2. **Connect the same GitHub repository**
3. **Configure:**
   ```
   Name: mukul-portfolio-frontend
   Branch: main
   Root Directory: client
   Build Command: npm install && npm run build
   Publish Directory: dist
   ```

4. **Add Environment Variable:**
   ```
   VITE_API_URL=https://mukul-portfolio-api.onrender.com
   ```

5. **Click "Create Static Site"**
6. **Your site will be available at:** `https://mukul-portfolio-frontend.onrender.com`

---

## 🚂 Option 2: Railway

### **Why Railway?**
- ✅ $5 free credit monthly
- ✅ Automatic deployments
- ✅ Simple configuration
- ✅ Built-in monitoring

### **Step 1: Deploy Backend**

1. **Go to [Railway](https://railway.app)**
2. **Sign up/Login with GitHub**
3. **Click "New Project" → "Deploy from GitHub repo"**
4. **Select your repository**
5. **Railway auto-detects Node.js**

6. **Configure Settings:**
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

7. **Set Environment Variables:**
   ```
   NODE_ENV=production
   JWT_SECRET=your-super-secret-jwt-key-here
   EMAIL_USER=mukulmee771@gmail.com
   EMAIL_PASSWORD=your-gmail-app-password
   EMAIL_RECIPIENT=mukulmee771@gmail.com
   ```

8. **Your API will be available at:** `https://your-app-name.railway.app`

### **Step 2: Deploy Frontend (Separate Service)**

1. **In the same project, click "New Service"**
2. **Connect the same GitHub repo**
3. **Configure for frontend:**
   ```
   Root Directory: client
   Build Command: npm install && npm run build
   Start Command: npx serve -s dist -p $PORT
   ```

4. **Add Environment Variable:**
   ```
   VITE_API_URL=https://your-backend-app.railway.app
   ```

---

## 🔧 Required Code Updates

### **1. Update Client Package.json**

Add serve for production hosting:

```bash
cd client
npm install --save-dev serve
```

### **2. Create API Service File**

Create `client/src/config/api.ts`:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const apiConfig = {
  baseURL: API_BASE_URL,
  endpoints: {
    projects: '/api/projects',
    auth: '/api/auth',
    contact: '/api/contact',
    settings: '/api/settings'
  }
};
```

### **3. Update API Calls**

Update all your API calls to use the config:

```typescript
// Instead of hardcoded URLs, use:
const response = await fetch(`${apiConfig.baseURL}${apiConfig.endpoints.projects}`);
```

---

## 🌐 Gmail App Password Setup

For contact form to work, you need a Gmail App Password:

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Go to:** [Google App Passwords](https://myaccount.google.com/apppasswords)
3. **Select App:** Mail
4. **Select Device:** Other (Custom name)
5. **Enter:** "Portfolio Website"
6. **Copy the 16-character password**
7. **Use this password** in your `EMAIL_PASSWORD` environment variable

---

## ✅ Deployment Checklist

### **Before Deployment:**
- [ ] Code pushed to GitHub
- [ ] Gmail App Password generated
- [ ] Environment variables prepared
- [ ] Local testing completed

### **After Backend Deployment:**
- [ ] API endpoints responding
- [ ] Environment variables set
- [ ] CORS configured correctly
- [ ] Contact form working

### **After Frontend Deployment:**
- [ ] Site loads correctly
- [ ] API calls working
- [ ] Admin panel accessible
- [ ] Responsive design working
- [ ] All pages functional

---

## 🔍 Testing Your Deployment

### **Test Backend API:**
```bash
# Test basic endpoint
curl https://your-api-url.onrender.com/

# Test projects endpoint
curl https://your-api-url.onrender.com/api/projects
```

### **Test Frontend:**
1. Visit your deployed site
2. Navigate through all pages
3. Test contact form
4. Login to admin panel
5. Try adding/editing a project

---

## 🐛 Troubleshooting

### **Common Issues:**

1. **Build Failures:**
   - Check build logs in platform dashboard
   - Verify package.json scripts
   - Ensure all dependencies are listed

2. **CORS Errors:**
   - Verify frontend URL in backend CORS config
   - Check environment variables are set

3. **API Not Found:**
   - Verify API URL in frontend config
   - Check backend deployment status

4. **Contact Form Not Working:**
   - Verify Gmail App Password
   - Check email environment variables

### **Getting Help:**
- Check platform documentation
- Review deployment logs
- Test locally first
- Check environment variables

---

## 💰 Cost Breakdown

### **Render (Free Tier):**
- 750 hours/month web services
- 100GB bandwidth/month
- Automatic SSL
- **Cost:** FREE

### **Railway (Free Tier):**
- $5 credit/month
- ~500 hours runtime
- 1GB RAM, 1 vCPU
- **Cost:** FREE (with usage limits)

---

## 🎯 Next Steps

1. **Deploy using your preferred platform**
2. **Test thoroughly**
3. **Set up custom domain (optional)**
4. **Monitor performance**
5. **Set up analytics (optional)**

Both platforms offer excellent free tiers for portfolio websites. Choose based on your preference and requirements!
