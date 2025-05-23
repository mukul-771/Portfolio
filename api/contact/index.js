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
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPassword
      },
      tls: {
        rejectUnauthorized: false
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

    // Test the connection first
    await transporter.verify();
    console.log('SMTP connection verified successfully');

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);

    res.status(201).json({ message: 'Contact form submitted successfully' });
  } catch (error) {
    console.error('Contact form error details:', {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response
    });

    // Provide more specific error messages
    let errorMessage = 'There was an error processing your message. Please try again or contact directly via email.';

    if (error.code === 'EAUTH') {
      errorMessage = 'Email authentication failed. Please contact directly via email: mukulmee771@gmail.com';
    } else if (error.code === 'ECONNECTION') {
      errorMessage = 'Email service temporarily unavailable. Please contact directly via email: mukulmee771@gmail.com';
    }

    res.status(500).json({ message: errorMessage });
  }
}

module.exports = allowCors(handler);
