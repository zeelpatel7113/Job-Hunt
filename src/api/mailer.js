import nodemailer from "nodemailer";

// re_GwrFUL9q_H5YBuVmzqfRCRM1zaUCBLCkC

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'zeelppatel21@gnu.ac.in', // Your Gmail email address
    pass: 'qfxflhazcvxbacbo', // App Password without spaces
  },
});

export async function main() {
  try {
    const info = await transporter.sendMail({
      from: '"Job Hunt" <zeelppatel21@gnu.ac.in>', // sender address
      to: "zeel6017@gmail.com", // recipient address
      subject: "Job Attention !!!", // Subject line
      html: '<h3>Test by Job Hunt html</h3>', // HTML body content
    });

    console.log("Message sent: %s", info.messageId); // log message ID for confirmation
  } catch (error) {
    console.error("Error sending email:", error); // handle any errors
  }
}

main().catch(console.error);
