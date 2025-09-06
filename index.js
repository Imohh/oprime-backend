import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";

const app = express();
app.use(cors());
app.use(express.json());

// POST /api/send
app.post("/api/send", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: "All fields are required" });
  }

  try {
    // Configure your domain email (from cPanel)
    const transporter = nodemailer.createTransport({
      host: "mail.oprimetech.com.ng", // your cPanel mail server
      port: 465,
      secure: true,
      auth: {
        // user: "info@oprimetech.com.ng", // your domain email
        user: process.env.EMAIL
        pass: process.env.EMAIL_PASS   // password stored safely in Vercel
      }
    });

    await transporter.sendMail({
      from: `"${name}" <info@oprimetech.com.ng>`, 
      to: "info@oprimetech.com.ng", // where the message is delivered
      subject: "New Contact Form Message",
      text: `From: ${name} (${email})\nMessage: ${message}`,
      html: `
        <h3>New Message from Website</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `
    });

    res.json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to send email" });
  }
});

// Vercel requires an export
export default app;
