/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendInviteEmail(email: string, token: string) {
    this.logger.log(`📧 Preparing to send invite email to: ${email}`);
    const inviteLink = `${process.env.FRONTEND_URL}/register/${token}`;

    const mailOptions = {
      from: `"Sleeky Programmers" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'You have been invited to join the Employee Portal',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h2>Welcome To Sleeky</h2>
          <p>You have been invited to join the company's Employee Portal.</p>
          <p>Click the link below to complete your registration:</p>
          <a href="${inviteLink}" 
             style="background-color: #4CAF50; color: white; padding: 10px 20px; 
             text-decoration: none; border-radius: 5px;">
            Complete Registration
          </a>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p>${inviteLink}</p>
          <p>Best regards,<br/>Admin</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Invite email sent successfully to ${email}`);
    } catch (error) {
      this.logger.error(
        ` Failed to send invite email to ${email}`,
        error.stack,
      );
      throw new Error('Email sending failed');
    }
  }
}
