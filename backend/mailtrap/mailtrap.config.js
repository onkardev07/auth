// const nodemailer = require("nodemailer");

// async function sendEmail() {
//   // Create a transporter object using Gmail SMTP transport
//   let transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: "onkar.salvi07@gmail.com", // replace with your Gmail address
//       pass: "dvgmxacbycchxpis", // replace with your Gmail app password
//     },
//   });

//   // Send mail with defined transport object
//   let info = await transporter.sendMail({
//     from: '"Onkar" <onkar.salvi07@gmail.com>', // sender address
//     to: "onkar.salvi89@gmail.com", // list of receivers
//     subject: "You are awesome!", // Subject line
//     text: "Congrats for sending test email with Gmail SMTP!", // plain text body
//     html: "<b>Congrats for sending test email with Gmail SMTP!</b>", // html body
//   });

//   console.log("Message sent: %s", info.messageId);
// }

// // Call the async function
// sendEmail().catch(console.error);

import { MailtrapClient } from "mailtrap";

const TOKEN = "b50fd32249a5db12e8d0667634753302";
const ENDPOINT = "https://send.api.mailtrap.io/";

export const client = new MailtrapClient({ endpoint: ENDPOINT, token: TOKEN });
