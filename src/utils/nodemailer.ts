import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;
const SENDER_NAME = process.env.SENDER_NAME;

console.log("Creddentialls ++++++++", EMAIL, PASSWORD);

export interface MailOptions {
  to: string;
  subject: string;
  message: string;
}

const sender = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL,
    pass: PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export async function sendEmail(
  p0: string,
  p1: string,
  p2: string,
  { to, subject, message }: MailOptions,
) {
  const mailOptions: nodemailer.SendMailOptions = {
    from: `"${SENDER_NAME}" <${EMAIL}>`,
    to,
    subject,
    text: message,
  };

  return new Promise((resolve, reject) => {
    sender.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("EMAILING USER FAILED:", error);
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
}
