import nodemailer from "nodemailer";
import { getAllUsersFromClerk } from "@/utils/clerk";// the function to get all users from Clerk

export async function sendEmailToAllUsers(subject, htmlContent) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'zeelppatel21@gnu.ac.in',
      pass: 'Zeel$7113',
    },
  });

  // Fetch user emails from Clerk
  const users = await getAllUsersFromClerk();

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
