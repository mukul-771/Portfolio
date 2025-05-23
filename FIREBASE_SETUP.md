# 🔥 Firebase Setup Guide for Portfolio

## Step 1: Create Firebase Project

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Create New Project**:
   - Project name: `mukul-portfolio`
   - Enable Google Analytics (optional)
   - Click "Create project"

## Step 2: Set Up Firestore Database

1. **In Firebase Console**:
   - Go to "Firestore Database"
   - Click "Create database"
   - Choose "Start in test mode"
   - Select your preferred location

2. **Create Collections**:
   - Collection ID: `projects`
   - Collection ID: `settings`

## Step 3: Set Up Firebase Storage

1. **In Firebase Console**:
   - Go to "Storage"
   - Click "Get started"
   - Choose "Start in test mode"
   - Select same location as Firestore

## Step 4: Get Configuration Keys

### Frontend Configuration (Client-side)

1. **In Firebase Console**:
   - Go to Project Settings (gear icon)
   - Scroll to "Your apps"
   - Click Web icon (`</>`)
   - App nickname: `portfolio-web`
   - Copy the config object

### Backend Configuration (Server-side)

1. **Generate Service Account**:
   - Go to Project Settings > Service accounts
   - Click "Generate new private key"
   - Download the JSON file
   - Copy the entire JSON content

## Step 5: Add Environment Variables to Vercel

### Frontend Variables (Client-side)
Add these in Vercel Dashboard > Settings > Environment Variables:

```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
```

### Backend Variables (Server-side)
Add these in Vercel Dashboard:

```
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"..."}
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
```

## Step 6: Security Rules

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to all documents
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Step 7: Test Firebase Connection

1. Deploy your updated code to Vercel
2. Check Vercel function logs for Firebase connection status
3. Test admin panel functionality

## Troubleshooting

- **Firebase not connecting**: Check environment variables are set correctly
- **Permission denied**: Update Firestore security rules
- **Service account errors**: Ensure JSON is properly formatted in environment variable

## Migration from Mock Data

Once Firebase is connected:
1. Your existing projects will be stored in Firestore
2. All admin panel operations will persist
3. Data will survive deployments and restarts
