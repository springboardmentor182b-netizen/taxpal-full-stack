import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { google } from "googleapis";
dotenv.config();
const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    const accessTokenObj = await oAuth2Client.getAccessToken();
    const accessToken = accessTokenObj.token; // get the string token

    if (!accessToken) throw new Error("Failed to get access token");

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // use TLS
      auth: {
        type: "OAuth2",
        user: process.env.GMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken,
      },
    });
    await transporter.sendMail({
      from: `Your App <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log("Email sent successfully");
  } catch (err) {
    console.error("Error sending email:", err);
  }
}
