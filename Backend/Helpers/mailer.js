const nodemailer = require("nodemailer");

// Configure the transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // or use "smtp.mailtrap.io", "hotmail", etc.
  auth: {
    user: process.env.EMAIL_USER,     // Your email
    pass: process.env.EMAIL_PASSWORD, // App password
  },
});

// Send email function
const sendEmail = async ({ from = process.env.EMAIL_USER, to, subject, html }) => {
  try {
    const mailOptions = {
      from: `"Potato Trails Admin" <${from}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return { success: true, info };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
};

module.exports = sendEmail;
