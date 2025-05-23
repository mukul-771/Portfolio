#!/bin/bash

# Portfolio Deployment Setup Script
echo "🚀 Setting up portfolio for deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "client" ] || [ ! -d "server" ]; then
    print_error "Please run this script from the root of your portfolio project"
    exit 1
fi

print_status "Found portfolio project structure"

# Install dependencies
print_info "Installing dependencies..."

# Install root dependencies (if any)
if [ -f "package.json" ]; then
    npm install
    print_status "Root dependencies installed"
fi

# Install client dependencies
print_info "Installing client dependencies..."
cd client
npm install
print_status "Client dependencies installed"

# Install server dependencies
print_info "Installing server dependencies..."
cd ../server
npm install
print_status "Server dependencies installed"

# Go back to root
cd ..

# Build client for testing
print_info "Building client for testing..."
cd client
npm run build
if [ $? -eq 0 ]; then
    print_status "Client build successful"
else
    print_error "Client build failed"
    exit 1
fi
cd ..

# Check if .env.example exists in server
if [ ! -f "server/.env.example" ]; then
    print_warning "No .env.example found in server directory"
    print_info "Creating .env.example..."
    cat > server/.env.example << EOF
PORT=5000
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_RECIPIENT=your-email@gmail.com
JWT_SECRET=your_jwt_secret_key
EOF
    print_status "Created server/.env.example"
fi

# Check if .env exists
if [ ! -f "server/.env" ]; then
    print_warning "No .env file found in server directory"
    print_info "Please copy .env.example to .env and fill in your values:"
    print_info "cp server/.env.example server/.env"
fi

# Display next steps
echo ""
print_status "Setup complete! Next steps:"
echo ""
print_info "1. Push your code to GitHub:"
echo "   git add ."
echo "   git commit -m 'Prepare for deployment'"
echo "   git push origin main"
echo ""
print_info "2. For Render deployment:"
echo "   - Go to https://dashboard.render.com"
echo "   - Follow the guide in RENDER_RAILWAY_DEPLOYMENT.md"
echo ""
print_info "3. For Railway deployment:"
echo "   - Go to https://railway.app"
echo "   - Follow the guide in RENDER_RAILWAY_DEPLOYMENT.md"
echo ""
print_info "4. Don't forget to set up your Gmail App Password!"
echo "   - Guide: https://myaccount.google.com/apppasswords"
echo ""
print_status "Good luck with your deployment! 🎉"
