import { TransportOptions } from 'nodemailer';
import nodemailer from 'nodemailer';

const sendEmail = async (options: TransportOptions) => {
    const transporter = nodemailer.createTransport({
        port: Number(process.env.EMAIL_PORT),
        host: String(process.env.EMAIL_HOST),
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

   const mailOptions = {
    from: 'Xu Ming <julian@ique.com>',
    to: options.email,
    subject: options.message,
    text: options.message
   }

  await transporter.sendMail(mailOptions)

};

export default sendEmail;