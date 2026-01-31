import nodemailer from 'nodemailer';
import { env } from '../../config/env';

// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: env.EMAIL_HOST,
  port: env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
  },
}) ;

// Verify connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Email configuration error:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

export interface VerificationEmailData {
  to: string;
  token: string;
  username?: string;
}

export class EmailService {
  static async sendVerificationEmail(data: VerificationEmailData): Promise<boolean> {
    try {
      // Create verification URL - adjust this based on your frontend URL
      const verificationUrl = `${process.env.FRONTEND_URL || `http://${env.URL_HOST}`}/verify-email?token=${data.token}`;
      
      const mailOptions = {
        from: env.EMAIL_FROM,
        to: data.to,
        subject: 'Verify your email address - Bear Social',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Welcome to Bear Social!</h2>
            <p>Hello ${data.username || ''},</p>
            <p>Thank you for registering with Bear Social. Please click the button below to verify your email address:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                Verify Email Address
              </a>
            </div>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
            <p>This link will expire in 24 hours.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            <p style="color: #888; font-size: 12px;">If you didn't create an account with Bear Social, please ignore this email.</p>
          </div>
        `,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('Verification email sent: ', info.messageId);
      return true;
    } catch (error) {
      console.error('Error sending verification email:', error);
      return false;
    }
  }

  static async sendTestEmail(to: string, subject: string, text: string): Promise<boolean> {
    try {
      const mailOptions = {
        from: env.EMAIL_FROM,
        to,
        subject,
        text,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('Test email sent: ', info.messageId);
      return true;
    } catch (error) {
      console.error('Error sending test email:', error);
      return false;
    }
  }
}