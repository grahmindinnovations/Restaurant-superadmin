import express from "express"
import nodemailer from "nodemailer"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

/* ---------- TEST ROUTE (ADD HERE) ---------- */
app.get("/test", async (req, res) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "Test Email",
      text: "Email working!"
    })

    res.send("Email sent")
  } catch (err) {
    console.log(err)
    res.send("Error sending email")
  }
})
/* ------------------------------------------- */

app.post("/schedule-meeting", async (req, res) => {
  try {
    const { clientName, clientEmail, meetingDate, meetingTime, meetingLink } = req.body

    const mailOptions = {
      from: `"CRM Team" <${process.env.EMAIL_USER}>`,
      to: clientEmail,
      subject: `Meeting Scheduled with ${clientName}`,
    
      text: `
    Hello ${clientName},
    
    Your meeting has been scheduled.
    
    Date: ${meetingDate}
    Time: ${meetingTime}
    Meeting Link: ${meetingLink}
    
    If you have questions, reply to this email.
    
    Regards,
    CRM Team
      `,
    
      html: `
      <div style="font-family:Arial,sans-serif">
        <h2>Hello ${clientName},</h2>
    
        <p>Your meeting has been scheduled successfully.</p>
    
        <p><strong>Date:</strong> ${meetingDate}</p>
        <p><strong>Time:</strong> ${meetingTime}</p>
    
        <p>
          <strong>Meeting Link:</strong><br/>
          <a href="${meetingLink}">${meetingLink}</a>
        </p>
    
        <p>If you have any questions, simply reply to this email.</p>
    
        <br/>
        <p>Regards,<br/>CRM Team</p>
      </div>
      `,
    
      replyTo: process.env.EMAIL_USER
    }

    await transporter.sendMail(mailOptions)

    res.status(200).json({ message: "Email sent" })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Email failed" })
  }
})

app.listen(5000, () => {
  console.log("Server running on port 5000")
})

console.log(process.env.EMAIL_USER)
console.log(process.env.EMAIL_PASS)