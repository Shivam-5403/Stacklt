// src/utils/emailUtils.js
import nodemailer from 'nodemailer';

const sendEmail = async ({ to, subject, html }) => {
    // Dummy transport for now — configure with real SMTP in production
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email', // or your SMTP service
        port: 587,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const info = await transporter.sendMail({
        from: '"StackIt" <noreply@stackit.com>',
        to,
        subject,
        html,
    });

    console.log('Email sent:', info.messageId);
};

export { sendEmail };
