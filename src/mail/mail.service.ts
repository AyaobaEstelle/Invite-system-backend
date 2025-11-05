// /* eslint-disable @typescript-eslint/no-unsafe-assignment */
// import { Injectable, Logger } from '@nestjs/common';
// import * as nodemailer from 'nodemailer';

// @Injectable()
// export class MailService {
//   private readonly transporter: nodemailer.Transporter;
//   private readonly logger = new Logger(MailService.name);

//   constructor() {
//     this.transporter = nodemailer.createTransport({
//       host: process.env.EMAIL_HOST,
//       port: Number(process.env.EMAIL_PORT),
//       secure: process.env.EMAIL_SECURE === 'true',
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     this.transporter
//       .verify()
//       .then(() => {
//         this.logger.log('SMTP connection verified');
//       })
//       .catch((err) => {
//         this.logger.error('SMTP connection failed', err.stack);
//       });
//   }

//   async sendInviteEmail(email: string, token: string) {
//     this.logger.log(`📧 Preparing to send invite email to: ${email}`);
//     const inviteLink = `${process.env.FRONTEND_URL}/register/${token}`;

//     const mailOptions = {
//       from: `"Sleeky Programmers" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: 'You have been invited to join the Employee Portal',
//       html: `
//         <div style="font-family: Arial, sans-serif; line-height: 1.5;">
//           <h2>Welcome To Sleeky</h2>
//           <p>You have been invited to join the company's Employee Portal.</p>
//           <p>Click the link below to complete your registration:</p>
//           <a href="${inviteLink}"
//              style="background-color: #4CAF50; color: white; padding: 10px 20px;
//              text-decoration: none; border-radius: 5px;">
//             Complete Registration
//           </a>
//           <p>If the button doesn't work, copy and paste this link into your browser:</p>
//           <p>${inviteLink}</p>
//           <p>Best regards,<br/>Admin</p>
//         </div>
//       `,
//     };

//     try {
//       await this.transporter.sendMail(mailOptions);
//       this.logger.log(`Invite email sent successfully to ${email}`);
//       return { success: true };
//     } catch (error: any) {
//       this.logger.error(
//         ` Failed to send invite email to ${email}: ${error.message}`,
//         error.stack,
//       );
//       return { success: false, error: error.message };
//     }
//   }
// }

import { Injectable, Logger } from '@nestjs/common';
import sgMail from '@sendgrid/mail';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
  }

  async sendInviteEmail(
    email: string,
    token: string,
  ): Promise<{ success: boolean; error?: string }> {
    this.logger.log(`Preparing to send invite email to: ${email}`);
    const inviteLink = `${process.env.FRONTEND_URL}/employee/register/${token}`;

    const mailOptions = {
      to: email,
      from: process.env.EMAIL_FROM!,
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
          <p>If the button doesn't work, copy and paste this link:</p>
          <p>${inviteLink}</p>
          <p>Best regards,<br/>Admin</p>
        </div>
      `,
    };

    try {
      await sgMail.send(mailOptions);
      this.logger.log(`Invite email sent successfully to ${email}`);
      return { success: true };
    } catch (error: any) {
      this.logger.error(
        `Failed to send invite email to ${email}: ${error.message}`,
        error.stack,
      );
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      return { success: false, error: error.message };
    }
  }
}
