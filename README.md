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
- **JSON Storage**: Completely free database solution with no external dependencies

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
- **Node.js** with Express
- **JSON file storage** (no database required)
- **JWT Authentication** for admin access
- **Multer** for file uploads
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
│       │   ├── layout/     # Layout components (Navbar, Footer)
│       │   └── ui/         # UI components
│       ├── hooks/          # Custom React hooks
│       ├── pages/          # Page components
│       └── utils/          # Utility functions
├── server/                 # Backend Node.js application
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── models/             # MongoDB models
│   └── routes/             # API routes
└── README.md               # Project documentation
```

## Customization

### Adding Projects
1. Add your projects to the MongoDB database using the API endpoints
2. Or modify the sample data in the `MyWork.tsx` file

### Changing Colors
1. Edit the color palette in the `tailwind.config.js` file

### Updating Content
1. Modify the text content in the respective page components

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements
- [GSAP](https://greensock.com/gsap/) for animations
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Shadcn UI](https://ui.shadcn.com/) for UI components
- [React](https://reactjs.org/) for the frontend framework
- [Express](https://expressjs.com/) for the backend framework

## 👨‍💻 Author

**Mukul Meena**
- Email: mukulmee771@gmail.com
- Location: Gujarat, India
- GitHub: [mukul-771](https://github.com/mukul-771)
