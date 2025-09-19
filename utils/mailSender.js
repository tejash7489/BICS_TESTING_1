// const nodemailer = require("nodemailer");

// const mailSender = async (email, body) => {
//     try{
//             let transporter = nodemailer.createTransport({
//                 host:process.env.MAIL_HOST,
                
//                 auth:{
//                     user: process.env.MAIL_USER,
//                     pass: process.env.MAIL_PASS,
//                 }
//             })


//             let info = await transporter.sendMail({
//                 from: 'Bharti International Public School',
//                 to:`${email}`,
//                 subject: "Change Your Password For Admin-Login Page.",
//                 html: `${body}`,
//             })

//             return info;
//     }
//     catch(error) {
//         console.log(error.message);
//     }
// }


// module.exports = mailSender;


const sgMail = require('@sendgrid/mail');
require("dotenv").config();

const mailSender = async (email, body) => {
  try {
    console.log("1 done");
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: email,
      from: {
        name: "Testing",
        email: process.env.MAIL_USER, // must be verified sender in SendGrid
      },
      subject: "Change Your Password For Admin-Login Page",
      text: "This is a plain text fallback",
      html: body,
    };

    console.log("2 done");

    const response = await sgMail.send(msg);
    console.log("3 done - Mail sent ✅");
    return response;
  } catch (error) {
    console.error("❌ SendGrid Error:", error.message);
    if (error.response) {
      console.error(error.response.body);
    }
    throw error;
  }
};

module.exports = mailSender;

