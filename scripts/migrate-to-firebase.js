// Migration script to transfer data from JSON to Firebase
// Run this script once after setting up Firebase to migrate your existing data

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin SDK
// Make sure to set your Firebase service account key as an environment variable
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}');

if (!serviceAccount.project_id) {
  console.error('❌ Firebase service account key not found!');
  console.log('Please set FIREBASE_SERVICE_ACCOUNT_KEY environment variable with your Firebase service account JSON');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET
});

const db = admin.firestore();

// Read the existing JSON data
const jsonDataPath = path.join(__dirname, '../server/db/projects.json');

async function migrateData() {
  try {
    console.log('🚀 Starting Firebase migration...');
    
    // Read JSON data
    const jsonData = JSON.parse(fs.readFileSync(jsonDataPath, 'utf8'));
    console.log(`📊 Found ${jsonData.projects?.length || 0} projects to migrate`);
    
    // Migrate projects
    if (jsonData.projects && jsonData.projects.length > 0) {
      console.log('📁 Migrating projects...');
      
      for (const project of jsonData.projects) {
        // Convert date strings to Firestore timestamps
        const projectData = {
          ...project,
          createdAt: project.createdAt ? admin.firestore.Timestamp.fromDate(new Date(project.createdAt)) : admin.firestore.Timestamp.now(),
          updatedAt: project.updatedAt ? admin.firestore.Timestamp.fromDate(new Date(project.updatedAt)) : admin.firestore.Timestamp.now()
        };
        
        // Remove the old ID and let Firestore generate a new one
        const { id, ...dataWithoutId } = projectData;
        
        // Add to Firestore
        const docRef = await db.collection('projects').add(dataWithoutId);
        console.log(`✅ Migrated project: ${project.title} (ID: ${docRef.id})`);
      }
    }
    
    // Migrate users
    if (jsonData.users && jsonData.users.length > 0) {
      console.log('👥 Migrating users...');
      
      for (const user of jsonData.users) {
        const userData = {
          ...user,
          createdAt: user.createdAt ? admin.firestore.Timestamp.fromDate(new Date(user.createdAt)) : admin.firestore.Timestamp.now()
        };
        
        // Remove the old ID and let Firestore generate a new one
        const { id, ...dataWithoutId } = userData;
        
        // Add to Firestore
        const docRef = await db.collection('users').add(dataWithoutId);
        console.log(`✅ Migrated user: ${user.email} (ID: ${docRef.id})`);
      }
    }
    
    // Migrate global settings
    if (jsonData.globalImageSettings) {
      console.log('⚙️ Migrating global settings...');
      
      const settingsData = {
        ...jsonData.globalImageSettings,
        updatedAt: admin.firestore.Timestamp.now()
      };
      
      // Set the global settings document
      await db.collection('settings').doc('globalImageSettings').set(settingsData);
      console.log('✅ Migrated global image settings');
    }
    
    console.log('🎉 Migration completed successfully!');
    console.log('');
    console.log('📋 Next steps:');
    console.log('1. Set up your Firebase environment variables in Vercel');
    console.log('2. Test the admin panel to ensure everything works');
    console.log('3. Deploy to Vercel');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrateData().then(() => {
  console.log('Migration script completed');
  process.exit(0);
}).catch((error) => {
  console.error('Migration script failed:', error);
  process.exit(1);
});
