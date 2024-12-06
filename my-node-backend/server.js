const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
// const { getAllUsersFromClerk } = require('./utils/clerk'); // Adjust path as necessary

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Placeholder users data for demo purposes (you would replace this with Clerk's users)
const users = [
  { email: 'zeel6017@gmail.com' },
  { email: 'zeel89982@gmail.com' },
  // Add more user emails here
];

// Function to simulate fetching all users from Clerk
app.get('/api/clerk-users', (req, res) => {
  try {
    // Send back the list of users
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching Clerk users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Email Sending Function
async function sendEmailToAllUsers(subject, htmlContent) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'zeelppatel21@gnu.ac.in', // Your email
      pass: 'Zeel$7113', // Your email password
    },
  });

  // Loop through each user and send an email
  for (const user of users) {
    try {
      const info = await transporter.sendMail({
        from: '"Job Hunt" <zeelppatel21@gnu.ac.in>',
        to: user.email,  // recipient email
        subject: subject,  // Subject line for the email
        html: htmlContent, // HTML content of the email
      });

      console.log(`Message sent to ${user.email}: %s`, info.messageId);
    } catch (err) {
      console.error(`Error sending email to: ${user.email}`, err);
    }
  }
}

// API to handle job posting and email sending
app.post('/api/send-email', async (req, res) => {
  const { title, description, users } = req.body;

  try {
    const subject = `New Job Posted: ${title}`;
    const htmlContent = `
      <h1>${title}</h1>
      <p>${description}</p>
    `;

    // Send emails to the provided list of users
    await sendEmailToAllUsers(subject, htmlContent);
    res.status(200).send('Emails sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending emails');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
