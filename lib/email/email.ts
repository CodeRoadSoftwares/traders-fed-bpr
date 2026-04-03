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
    console.log("email sent");
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
