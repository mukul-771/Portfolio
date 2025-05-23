# 🚀 Vercel Deployment Guide with Firebase

Complete guide for deploying your MERN stack portfolio to Vercel with Firebase backend.

## 📋 Prerequisites

- ✅ Firebase project set up (follow `FIREBASE_SETUP_GUIDE.md`)
- ✅ GitHub repository with your code
- ✅ Vercel account connected to GitHub

---

## 🔧 Step 1: Prepare for Deployment

### Update Package Scripts

Ensure your `client/package.json` has the correct build script:

```json
{
  "scripts": {
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  }
}
```

### Verify Dependencies

Make sure all dependencies are properly installed:

```bash
# Client dependencies
cd client
npm install

# API dependencies  
cd ../api
npm install
```

---

## 🌍 Step 2: Set Up Environment Variables

### Required Environment Variables for Vercel

**Frontend Variables (VITE_*):**
```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**API Variables:**
```
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...entire_json...}
FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
```

**Email Variables (for contact form):**
```
EMAIL_USER=mukulmee771@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
EMAIL_RECIPIENT=mukulmee771@gmail.com
```

---

## 🚀 Step 3: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Configure project:**
   - Framework Preset: `Other`
   - Root Directory: `./` (leave empty)
   - Build Command: `cd client && npm install && npm run build`
   - Output Directory: `client/dist`
   - Install Command: `npm install`

5. **Add Environment Variables** (all the variables listed above)
6. **Click "Deploy"**

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

---

## ⚙️ Step 4: Configure Domain & Settings

### Custom Domain (Optional)

1. **Go to your project in Vercel Dashboard**
2. **Click "Settings" > "Domains"**
3. **Add your custom domain**
4. **Follow DNS configuration instructions**

### Function Configuration

Your `vercel.json` is already configured for:
- ✅ 30-second timeout for API functions
- ✅ Proper routing for SPA
- ✅ Static file serving

---

## 🧪 Step 5: Test Deployment

### Test Frontend

1. **Visit your deployed URL**
2. **Navigate through all pages:**
   - Home page loads
   - About page works
   - MY Work page shows projects
   - Contact form submits
   - Project detail pages load

### Test Admin Panel

1. **Go to `/admin`**
2. **Login with credentials:**
   - Email: `mukul.meena@iitgn.ac.in`
   - Password: `g6QtckJh`
3. **Test functionality:**
   - View existing projects
   - Add new project
   - Upload images
   - Edit project
   - Delete project (optional)

### Test API Endpoints

```bash
# Test projects endpoint
curl https://your-app.vercel.app/api/projects

# Test featured projects
curl https://your-app.vercel.app/api/projects/featured

# Test specific project
curl https://your-app.vercel.app/api/projects/PROJECT_ID
```

---

## 🔍 Troubleshooting

### Common Issues & Solutions

#### 1. Build Failures

**Error**: `Module not found` or `Cannot resolve module`
**Solution**: 
```bash
# Clear node_modules and reinstall
rm -rf client/node_modules api/node_modules
cd client && npm install
cd ../api && npm install
```

#### 2. Environment Variables Not Working

**Error**: `Firebase project not found`
**Solution**:
- Check variable names (VITE_ prefix for frontend)
- Verify values don't have extra spaces
- Ensure JSON is properly escaped for FIREBASE_SERVICE_ACCOUNT_KEY

#### 3. API Functions Timeout

**Error**: `Function execution timed out`
**Solution**:
- Check Firebase connection
- Verify service account key is correct
- Increase timeout in vercel.json (already set to 30s)

#### 4. Image Upload Failures

**Error**: `Failed to upload image`
**Solution**:
- Check Firebase Storage rules
- Verify FIREBASE_STORAGE_BUCKET variable
- Ensure formidable is installed in API dependencies

#### 5. CORS Errors

**Error**: `Access to fetch blocked by CORS`
**Solution**:
- Verify API routes are working
- Check network tab for actual error
- Ensure proper API URL configuration

---

## 📊 Step 6: Monitor & Maintain

### Vercel Analytics

1. **Enable Analytics** in Vercel Dashboard
2. **Monitor performance** and usage
3. **Check function logs** for errors

### Firebase Usage

1. **Monitor Firestore usage** in Firebase Console
2. **Check Storage usage** for uploaded images
3. **Review security rules** periodically

---

## 🎯 Post-Deployment Checklist

- [ ] All pages load correctly
- [ ] Admin panel login works
- [ ] Can add new projects
- [ ] Image uploads work
- [ ] Contact form sends emails
- [ ] Projects display on frontend
- [ ] Mobile responsiveness works
- [ ] Performance is acceptable

---

## 🔄 Future Updates

### To Update Your Site:

1. **Make changes locally**
2. **Test thoroughly**
3. **Push to GitHub**
4. **Vercel auto-deploys** from main branch

### To Add New Projects:

1. **Go to your-site.vercel.app/admin**
2. **Login with admin credentials**
3. **Click "Add Project"**
4. **Fill in details and upload images**
5. **Save - appears immediately on site**

---

## 🎉 Success!

Your portfolio is now deployed with:
- ✅ **Dynamic project management** via admin panel
- ✅ **Persistent data storage** with Firebase
- ✅ **Image uploads** to Firebase Storage
- ✅ **Serverless architecture** on Vercel
- ✅ **Free hosting** with room to scale

You can now add new projects anytime through the admin panel, and they'll appear immediately on your live website!
