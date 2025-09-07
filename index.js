const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const Contact = require('./models/Contact');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Contact form endpoint
app.post("/api/send", async (req, res) => {
  const { email, subject, message } = req.body;

  if (!email || !subject || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // const transporter = nodemailer.createTransport({
    //   host: "smtp.gmail.com", // or your mail server
    //   port: 465,
    //   secure: true,
    //   auth: {
    //     user: process.env.EMAIL_USER,
    //     pass: process.env.EMAIL_PASS,
    //   },
    // });

    const transporter = nodemailer.createTransport({
      host: "mail.oprimetech.com.ng", // or your mail server
      port: 465,
      secure: true,
      auth: {
        user: "info@oprimetech.com.ng",
        pass: "Iamnotorious88@",
      },
    });

    await transporter.sendMail({
      from: "Oprime Tech info@oprimetech.com.ng",
      to: "info@oprimetech.com.ng", // send to yourself
      subject: `New message from ${email}: ${subject}`,
      html: `<p><strong>From:</strong> ${email}</p>
             <p><strong>Message:</strong> ${message}</p>`,
    });

    res.status(200).json({ success: true, message: "Email sent!" });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ error: "Email failed to send" });
  }
});

app.post('/contact', async (req, res) => {
  try {
    const { fullName, email, message } = req.body;
    const formEntry = new Contact({
      subject,
      email,
      message,
    });
    await formEntry.save();
    res.status(200).json({ message: 'Form data saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/contact', async (req, res) => {
  try {
    const contacts = await Contact.find(); // Assuming ContactForm is your Mongoose model
    res.status(200).json(contacts);
  } catch (error) {
    console.error('Error getting contacts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
