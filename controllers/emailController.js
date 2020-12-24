const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');

const email = process.env.EMAIL;
const password = process.env.EMAIL_PASSWORD;
const url = process.env.MAIN_URL;

exports.sendMail = async (req, res, next) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    secure: true,
    auth: {
      user: email,
      pass: password,
    },
  });
  let mailOptions = {
    from: 'alteo.caka@gmail.com',
    to: req.body.email,
    subject: 'Signup Successful',
  };
  await transporter
    .sendMail(mailOptions)
    .then(() => {
      return res
        .status(200)
        .json({ msg: 'you should receive an email from us' });
    })
    .catch((error) => console.error(error));
};
