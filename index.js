const express = require("express");
const app = express();
const cors = require("cors");
const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const dotenv = require("dotenv").config();
const URL = process.env.db;
const nodemailer = require("nodemailer");
const EMAIL = process.env.email;
const PASSWORD = process.env.password;
const MYID = process.env.myid;

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

app.post("/send/mail", async (req, res) => {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("Portfolio");

    const user = await db.collection("visters").insertOne(req.body);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL,
        pass: PASSWORD,
      },
    });
    const mailOptions = {
      from: EMAIL,
      to: MYID,
      subject: "Portfolio Mail's",
      html: `<h3><b>Name :</b> ${req.body.name}, <b>Email :</b> ${req.body.email},
          <b>Message :</b> ${req.body.message}</h3>
           `,
    };
    const mailOptionstwo = {
      from: EMAIL,
      to: req.body.email,
      subject: "Your mail successfully sended",
      html: `<h3>Hi iam Vinoth Kumar R, mail received. Thankyou for visiting and contacting me</h3>
             `,
    };
    transporter.sendMail(mailOptions),
      transporter.sendMail(mailOptionstwo),
      function (error, response) {
        if (error) {
          return;
        }
      };

    transporter.close();

    res.json({ message: "Mail sended successfully" });

    await connection.close();
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
});

app.listen(process.env.PORT || 6002);
