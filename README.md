# Portfolio Website V1.0

A modern, responsive portfolio website built with the MERN stack, featuring smooth GSAP animations, Tailwind CSS styling, and a comprehensive admin dashboard for content management.

## 🚀 Features

- **Responsive Design**: Optimized for all devices (mobile, tablet, desktop)
- **Modern UI**: Clean, minimal design with glass-like navigation and smooth animations
- **GSAP Animations**: Smooth, professional animations throughout the site
- **Admin Dashboard**: Full content management system for projects and settings
- **Project Management**: Add, edit, delete projects with image uploads
- **Category System**: Separate views for Developer and Designer projects
- **Featured Projects**: Highlight your best work on the homepage
- **Contact Form**: Functional contact form with email integration
- **Image Management**: Advanced image controls with aspect ratios and responsive settings
- **Firebase Integration**: Firestore database and Storage for persistent data and image uploads

## 🛠️ Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **GSAP** for animations
- **React Router** for navigation
- **Shadcn UI** components
- **Lucide React** for icons

### Backend
- **Vercel Serverless Functions** for API
- **Firebase Firestore** for database
- **Firebase Storage** for image uploads
- **JWT Authentication** for admin access
- **Nodemailer** for contact form emails
- **bcryptjs** for password hashing

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd WEBSITE
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the server directory:
   ```env
   PORT=5000
   JWT_SECRET=your_jwt_secret_here
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```

4. **Start the development servers**
   ```bash
   # From the server directory
   npm run dev
   ```
   This will start both the backend (port 5000) and frontend (port 5173) concurrently.

## 📱 Pages

- **Home**: Hero section with featured projects
- **About Me**: Personal information with Designer/Developer toggle
- **MY Work**: Complete project portfolio with category filtering
- **Get In Touch**: Contact form and social links
- **Admin Dashboard**: Content management system (protected route)

## 🔐 Admin Access

- **URL**: `/admin`
- **Email**: `mukul.meena@iitgn.ac.in`
- **Password**: `g6QtckJh`

### Admin Features
- Add/Edit/Delete projects
- Upload and manage images
- Toggle featured projects
- Advanced image settings (aspect ratios, sizing)
- Real-time preview of changes

## Project Structure

```
portfolio-website/
├── client/                 # Frontend React application
│   ├── public/             # Public assets
│   └── src/
│       ├── assets/         # Images, fonts, etc.
│       ├── components/     # Reusable components
│       │   ├── animations/ # GSAP animation components
│       │   ├── admin/      # Admin panel components
│       │   ├── layout/     # Layout components (Navbar, Footer)
│       │   └── ui/         # UI components
│       ├── config/         # Configuration files (Firebase)
│       ├── hooks/          # Custom React hooks
│       ├── pages/          # Page components
│       ├── services/       # API service functions
│       └── utils/          # Utility functions
├── api/                    # Vercel serverless functions
│   ├── _utils/             # Utility functions (Firebase, auth)
│   ├── auth/               # Authentication endpoints
│   ├── projects/           # Project management endpoints
│   └── settings/           # Settings endpoints
├── scripts/                # Migration and setup scripts
└── README.md               # Project documentation
```

## 🚀 Deployment

This project is optimized for **Vercel deployment** with Firebase backend.

### Quick Deploy

1. **Set up Firebase** (follow `FIREBASE_SETUP_GUIDE.md`)
2. **Deploy to Vercel** (follow `VERCEL_DEPLOYMENT_GUIDE.md`)
3. **Migrate data** using the provided migration script
4. **Test admin panel** functionality

### Key Features After Deployment

- ✅ **Dynamic project management** through admin panel
- ✅ **Persistent data storage** with Firebase Firestore
- ✅ **Image uploads** to Firebase Storage
- ✅ **Serverless architecture** for optimal performance
- ✅ **Free hosting** with room to scale

## Customization

### Adding Projects
1. **Use the admin panel** at `/admin` to add projects dynamically
2. **Upload images** directly through the interface
3. **Set featured projects** to highlight on homepage

### Changing Colors
1. Edit the color palette in the `tailwind.config.js` file

### Updating Content
1. Modify the text content in the respective page components
2. Update profile information in the About page

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements
- [GSAP](https://greensock.com/gsap/) for animations
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Shadcn UI](https://ui.shadcn.com/) for UI components
- [React](https://reactjs.org/) for the frontend framework
- [Firebase](https://firebase.google.com/) for backend services
- [Vercel](https://vercel.com/) for hosting and serverless functions

## 👨‍💻 Author

**Mukul Meena**
- Email: mukulmee771@gmail.com
- Location: Gujarat, India
- GitHub: [mukul-771](https://github.com/mukul-771)
