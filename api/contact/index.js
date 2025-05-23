// Vercel API route for contact form
const allowCors = require('../_utils/cors');
const nodemailer = require('nodemailer');

async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        message: 'All fields are required' 
      });
    }

    // Check if email configuration is set up
    const emailUser = process.env.EMAIL_USER;
    const emailPassword = process.env.EMAIL_PASSWORD;

    if (!emailUser || !emailPassword || emailUser === 'your-email@gmail.com' || emailPassword === 'your-app-password') {
      console.log('Email configuration not set up properly. Contact form data:', { name, email, subject, message });
      // For now, just log the contact and return success
      return res.status(201).json({
        message: 'Contact form submitted successfully. Your message has been received and will be processed manually.'
      });
    }

    // Send email notification
    const transporter = nodemailer.createTransporter({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: emailUser,
        pass: emailPassword
      }
    });

    const mailOptions = {
      from: emailUser,
      to: process.env.EMAIL_RECIPIENT || emailUser,
      subject: `Portfolio Contact: ${subject}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'Contact form submitted successfully' });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      message: 'There was an error processing your message. Please try again or contact directly via email.'
    });
  }
}

module.exports = allowCors(handler);
