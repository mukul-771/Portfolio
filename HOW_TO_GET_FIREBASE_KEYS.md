# 🔑 How to Get Firebase Configuration Keys

This guide will show you exactly where to find all the Firebase configuration values needed for your portfolio.

## 🚀 Step 1: Create Firebase Project

1. **Go to [Firebase Console](https://console.firebase.google.com/)**
2. **Click "Create a project"**
3. **Enter project name**: `mukul-portfolio` (or any name you prefer)
4. **Disable Google Analytics** (not needed)
5. **Click "Create project"**

---

## 🔧 Step 2: Get Frontend Variables (VITE_*)

### Add Web App to Firebase Project

1. **In Firebase Console, click the "Web" icon** (`</>`) to add a web app
2. **Enter app nickname**: `portfolio-frontend`
3. **Don't check "Firebase Hosting"**
4. **Click "Register app"**

### Copy Configuration Values

You'll see a config object like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "mukul-portfolio.firebaseapp.com",
  projectId: "mukul-portfolio",
  storageBucket: "mukul-portfolio.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
};
```

**Map these to your environment variables:**

```env
VITE_FIREBASE_API_KEY=AIzaSyC...
VITE_FIREBASE_AUTH_DOMAIN=mukul-portfolio.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=mukul-portfolio
VITE_FIREBASE_STORAGE_BUCKET=mukul-portfolio.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123def456
```

---

## 🔐 Step 3: Get API Variables

### Generate Service Account Key

1. **Go to Project Settings** (gear icon in Firebase Console)
2. **Click "Service accounts" tab**
3. **Click "Generate new private key"**
4. **Click "Generate key"** - this downloads a JSON file

### Extract Service Account Values

The downloaded JSON file looks like this:

```json
{
  "type": "service_account",
  "project_id": "mukul-portfolio",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-...@mukul-portfolio.iam.gserviceaccount.com",
  "client_id": "123456789...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
}
```

**For environment variables:**

```env
# Copy the ENTIRE JSON content as a single line string
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"mukul-portfolio",...}

# Use the same storage bucket from frontend config
FIREBASE_STORAGE_BUCKET=mukul-portfolio.appspot.com

# Generate a secure JWT secret (minimum 32 characters)
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long_and_secure
```

---

## 📧 Step 4: Get Email Variables (Gmail App Password)

### Enable 2-Factor Authentication

1. **Go to [Google Account Settings](https://myaccount.google.com/)**
2. **Click "Security"**
3. **Enable "2-Step Verification"** if not already enabled

### Generate App Password

1. **Go to [App Passwords](https://myaccount.google.com/apppasswords)**
2. **Select app**: "Mail"
3. **Select device**: "Other (Custom name)"
4. **Enter name**: "Portfolio Website"
5. **Click "Generate"**
6. **Copy the 16-character password** (e.g., `abcd efgh ijkl mnop`)

### Email Environment Variables

```env
EMAIL_USER=mukulmee771@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
EMAIL_RECIPIENT=mukulmee771@gmail.com
```

---

## 🔥 Step 5: Set Up Firestore Database

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

## 📁 Step 6: Set Up Firebase Storage

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

## 📝 Step 7: Complete Environment Variables

### For Local Development

Create `client/.env.local`:
```env
VITE_FIREBASE_API_KEY=your_actual_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Create `api/.env.local`:
```env
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...entire_json_here...}
FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
EMAIL_USER=mukulmee771@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
EMAIL_RECIPIENT=mukulmee771@gmail.com
```

### For Vercel Deployment

Add these same variables in your Vercel dashboard under:
**Project Settings → Environment Variables**

---

## ⚠️ Important Security Notes

1. **Never commit** `.env` files to Git
2. **Keep service account JSON secure** - treat it like a password
3. **Use different Firebase projects** for development and production
4. **Regenerate keys** if accidentally exposed

---

## 🧪 Step 8: Test Configuration

After setting up all variables:

1. **Run locally**:
   ```bash
   cd client && npm run dev
   ```

2. **Test admin panel**:
   - Go to `http://localhost:5173/admin`
   - Login with your credentials
   - Try adding a project
   - Upload an image

3. **Check Firebase Console**:
   - Verify data appears in Firestore
   - Check images in Storage

---

## 🎯 Quick Checklist

- [ ] Firebase project created
- [ ] Web app added to Firebase
- [ ] Frontend config copied
- [ ] Service account key downloaded
- [ ] Firestore database created
- [ ] Storage bucket created
- [ ] Gmail app password generated
- [ ] Environment variables set
- [ ] Local testing successful

You're now ready to deploy to Vercel! 🚀
