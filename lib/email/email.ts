import nodemailer from "nodemailer";

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail(options: EmailOptions) {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || "noreply@tradersfed.com",
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
    return true;
  } catch (error) {
    console.error("Email send failed:", error);
    return false;
  }
}

export function generateRenewalReminderEmail(
  shopName: string,
  certificateNumber: string,
  expiryDate: Date,
): string {
  return `
    <h2>Certificate Renewal Reminder</h2>
    <p>Dear ${shopName},</p>
    <p>Your certificate <strong>${certificateNumber}</strong> will expire on <strong>${expiryDate.toLocaleDateString()}</strong>.</p>
    <p>Please renew your certificate before the expiry date to avoid any inconvenience.</p>
    <p>Thank you,<br/>Traders Federation</p>
  `;
}

export function generateUrgentNoticeEmail(
  title: string,
  message: string,
): string {
  return `
    <h2>🚨 Urgent Notice</h2>
    <h3>${title}</h3>
    <p>${message}</p>
    <p>Thank you,<br/>Traders Federation</p>
  `;
}

export function generateOtpEmail(otp: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .otp-box { background: white; border: 2px dashed #3b82f6; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
        .otp-code { font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 8px; font-family: monospace; }
        .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; margin: 20px 0; border-radius: 4px; }
        .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">Password Reset Request</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Traders Federation</p>
        </div>
        <div class="content">
          <p>Hello,</p>
          <p>You requested to reset your password. Use the OTP code below to proceed:</p>
          
          <div class="otp-box">
            <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">Your OTP Code</p>
            <div class="otp-code">${otp}</div>
            <p style="margin: 10px 0 0 0; color: #6b7280; font-size: 12px;">Valid for 10 minutes</p>
          </div>

          <div class="warning">
            <strong>⚠️ Security Notice:</strong> If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
          </div>

          <p>For security reasons, this OTP will expire in 10 minutes.</p>
          
          <p>Best regards,<br/>
          <strong>Traders Federation Team</strong></p>
        </div>
        <div class="footer">
          <p>This is an automated email. Please do not reply to this message.</p>
          <p>&copy; ${new Date().getFullYear()} Traders Federation. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function generatePasswordResetSuccessEmail(name: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .success-icon { font-size: 48px; margin-bottom: 10px; }
        .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="success-icon">✓</div>
          <h1 style="margin: 0;">Password Reset Successful</h1>
        </div>
        <div class="content">
          <p>Hello ${name},</p>
          <p>Your password has been successfully reset. You can now log in with your new password.</p>
          <p>If you did not make this change, please contact us immediately.</p>
          <p>Best regards,<br/>
          <strong>Traders Federation Team</strong></p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Traders Federation. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
