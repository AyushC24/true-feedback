import nodemailer from 'nodemailer';
// import VerificationEmail from '../../emails/VerificationEmail';
import { ApiResponse } from '@/types/ApiResponse';

// Create a transporter using your email service configuration
const transporter = nodemailer.createTransport({
  service: 'gmail', // or any other email service you use
  auth: {
    user: process.env.APP_USER, 
    pass: process.env.APP_PASSWORD, 
  },
});

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const emailContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verification Email</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 10px;
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 20px;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      color: #333333;
    }
    .content {
      padding: 20px;
      border-top: 2px solid #eeeeee;
      border-bottom: 2px solid #eeeeee;
      margin-bottom: 20px;
    }
    .content p {
      margin: 10px 0;
      color: black;
    }
    .name {
      font-size : 1.5em;
    }
    .footer {
      text-align: center;
      font-weight: bold;
      color: black;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to Feedonymous</h1>
    </div>
    <div class="content">
      <p class = "name">Hello ${username},</p>
      <p>Thank you for registering. Please use the following verification code to complete your verification:</p>
      <h2>${verifyCode}</h2>
      <p>If you did not request this code, please ignore this email.</p>
    </div>
    <div class="footer">
      <p>This email was sent by Feedonymous.</p>
    </div>
  </div>
</body>
</html>
`
    // Send the email using Nodemailer
    await transporter.sendMail({
      from: "ayushchandra73@gmail.com", // Your email address
      to: email,
      subject: 'Feedonymous Yours TrueFeedback Verification Code',
      html: emailContent
    });

    return { success: true, message: 'Verification email sent successfully.' };
  } catch (emailError) {
    console.error('Error sending verification email:', emailError);
    return { success: false, message: 'Failed to send verification email.' };
  }
}
