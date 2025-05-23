# Email Setup Instructions for Contact Form

## Current Status
✅ **Contact form is working!** Messages are being received and logged by the server.
✅ **Form validation and error handling** are properly implemented.
✅ **All contact information** has been updated with your details.

## To Enable Email Notifications (Optional)

If you want to receive actual email notifications when someone submits the contact form, follow these steps:

### 1. Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Copy the 16-character password

### 2. Update Server Configuration

Edit the `server/.env` file and replace the placeholder values:

```env
PORT=5001
EMAIL_SERVICE=gmail
EMAIL_USER=mukulmee771@gmail.com
EMAIL_PASSWORD=your-16-character-app-password-here
EMAIL_RECIPIENT=mukulmee771@gmail.com

# JWT Secret for authentication
JWT_SECRET=your_jwt_secret_key_change_this_in_production
```

### 3. Restart the Server

After updating the `.env` file:
```bash
cd server
npm start
```

## Alternative Email Services

You can also use other email services by changing the `EMAIL_SERVICE` in `.env`:

- `EMAIL_SERVICE=outlook` (for Outlook/Hotmail)
- `EMAIL_SERVICE=yahoo` (for Yahoo Mail)
- Or configure custom SMTP settings

## Testing

Once configured, test the contact form and you should receive emails at `mukulmee771@gmail.com`.

## Current Behavior (Without Email Setup)

- ✅ Form submissions are validated
- ✅ Success/error messages are shown to users
- ✅ Contact data is logged in server console
- ✅ Users receive confirmation that their message was received
- ❌ No actual emails are sent (requires setup above)

## Security Note

Never commit your actual email password to version control. The `.env` file should be added to `.gitignore`.
