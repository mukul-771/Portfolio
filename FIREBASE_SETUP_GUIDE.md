# 🔥 Firebase Setup Guide for Vercel Deployment

This guide will help you set up Firebase for your portfolio website to enable dynamic project management after Vercel deployment.

## 📋 Overview

Firebase will provide:
- **Firestore Database**: For storing projects, users, and settings
- **Firebase Storage**: For storing uploaded images
- **Free Tier**: Completely free for your portfolio's usage level

---

## 🚀 Step 1: Create Firebase Project

1. **Go to [Firebase Console](https://console.firebase.google.com/)**
2. **Click "Create a project"**
3. **Enter project name**: `mukul-portfolio` (or your preferred name)
4. **Disable Google Analytics** (not needed for this project)
5. **Click "Create project"**

---

## 🔧 Step 2: Set Up Firestore Database

1. **In Firebase Console, go to "Firestore Database"**
2. **Click "Create database"**
3. **Choose "Start in production mode"**
4. **Select location**: Choose closest to your users (e.g., `us-central1`)
5. **Click "Done"**

### Configure Firestore Rules

Go to "Rules" tab and replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to all documents
    match /{document=**} {
      allow read: if true;
    }
    
    // Allow write access only to authenticated users
    match /projects/{projectId} {
      allow write: if request.auth != null;
    }
    
    match /settings/{settingId} {
      allow write: if request.auth != null;
    }
    
    match /users/{userId} {
      allow write: if request.auth != null;
    }
  }
}
```

---

## 📁 Step 3: Set Up Firebase Storage

1. **Go to "Storage" in Firebase Console**
2. **Click "Get started"**
3. **Choose "Start in production mode"**
4. **Select same location as Firestore**
5. **Click "Done"**

### Configure Storage Rules

Go to "Rules" tab and replace with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /project-images/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## 🔑 Step 4: Get Firebase Configuration

### For Client-Side (Frontend)

1. **Go to Project Settings** (gear icon)
2. **Scroll to "Your apps"**
3. **Click "Web" icon (</>) to add web app**
4. **Enter app nickname**: `portfolio-frontend`
5. **Don't check "Firebase Hosting"**
6. **Click "Register app"**
7. **Copy the config object** - you'll need this for environment variables

### For Server-Side (API)

1. **Go to Project Settings > Service Accounts**
2. **Click "Generate new private key"**
3. **Download the JSON file**
4. **Keep this file secure** - you'll need its contents for environment variables

---

## 🌍 Step 5: Set Up Environment Variables

### For Local Development

Create `client/.env.local`:
```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Create `api/.env.local`:
```env
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your_project_id",...}
FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
JWT_SECRET=your_super_secret_jwt_key_here
```

### For Vercel Deployment

In your Vercel dashboard, add these environment variables:

**Frontend Environment Variables:**
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

**API Environment Variables:**
- `FIREBASE_SERVICE_ACCOUNT_KEY` (entire JSON as string)
- `FIREBASE_STORAGE_BUCKET`
- `JWT_SECRET`

---

## 📊 Step 6: Migrate Existing Data

1. **Install dependencies**:
   ```bash
   npm install firebase-admin
   ```

2. **Set environment variables** for the migration script
3. **Run migration**:
   ```bash
   cd scripts
   node migrate-to-firebase.js
   ```

---

## 🧪 Step 7: Test Locally

1. **Install dependencies**:
   ```bash
   cd client && npm install
   cd ../api && npm install
   ```

2. **Start development servers**:
   ```bash
   # Terminal 1 - Frontend
   cd client && npm run dev
   
   # Terminal 2 - API (for testing)
   cd api && vercel dev
   ```

3. **Test admin functionality**:
   - Go to `/admin`
   - Login with your credentials
   - Try adding/editing a project
   - Upload an image

---

## 🚀 Step 8: Deploy to Vercel

1. **Push your code to GitHub**
2. **Connect repository to Vercel**
3. **Add environment variables in Vercel dashboard**
4. **Deploy**

---

## 🔍 Troubleshooting

### Common Issues:

1. **"Permission denied" errors**:
   - Check Firestore/Storage rules
   - Ensure authentication is working

2. **"Project not found" errors**:
   - Verify Firebase project ID in environment variables
   - Check service account key format

3. **Image upload failures**:
   - Verify Storage bucket name
   - Check Storage rules allow writes

4. **Build failures**:
   - Ensure all environment variables are set
   - Check for typos in variable names

---

## 💰 Firebase Free Tier Limits

Your portfolio will easily stay within these limits:

- **Firestore**: 50K reads, 20K writes per day
- **Storage**: 1GB storage, 10GB transfer per month
- **Functions**: 125K invocations per month

---

## 🎯 Next Steps

After successful setup:

1. ✅ Test admin panel functionality
2. ✅ Verify image uploads work
3. ✅ Deploy to Vercel
4. ✅ Test production deployment
5. ✅ Add new projects through admin panel

Your portfolio will now support dynamic project management with persistent data storage!
