import nodemailer from "nodemailer";
import { InternalError } from "../utils/errors.js";

// options include smpt server host and port
const transporter = nodemailer.createTransport({
  host: "localhost",
  port: 1025,
  secure: false,
});

interface sendEmailProps {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

async function sendEmail(props: sendEmailProps) {
  try {
    const { to, subject, text, html = "" } = props;

    if (process.env.SEND_EMAIL == "true") {
      const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to,
        subject,
        text,
        html,
      });
      console.log("Message sent:", info.messageId);
    }
  } catch (error) {
    console.info("error:===>", error);
    throw new InternalError();
  }
}

export { sendEmail };
