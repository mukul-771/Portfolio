const nodemailer = require('nodemailer');

// Create a new contact submission and send email
exports.submitContact = async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if email configuration is set up
    const emailUser = process.env.EMAIL_USER;
    const emailPassword = process.env.EMAIL_PASSWORD;

    if (!emailUser || !emailPassword || emailUser === 'your-email@gmail.com' || emailPassword === 'your-app-password') {
      console.log('Email configuration not set up properly. Contact form data:', { name, email, subject, message });
      // For now, just log the contact and return success
      // In production, you would want to set up proper email credentials
      return res.status(201).json({
        message: 'Contact form submitted successfully. Your message has been received and will be processed manually.'
      });
    }

    // Send email notification
    const transporter = nodemailer.createTransport({
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
  } catch (err) {
    console.error('Contact form error:', err);
    res.status(500).json({
      message: 'There was an error processing your message. Please try again or contact directly via email.'
    });
  }
};

// Get all contacts (admin only) - Returns empty array in JSON mode
exports.getContacts = async (req, res) => {
  try {
    // In JSON storage mode, we don't store contacts
    // Return empty array or mock data
    res.json([]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
