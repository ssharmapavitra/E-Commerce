"use strict";
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

let user = process.env.EMAIL_USERNAME;
let pass = process.env.EMAIL_PASSWORD;

const transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 587,
	secure: false, // true for 465, false for other ports
	auth: {
		user: user,
		pass: pass,
	},
});

//Sign Up Mail
function sendSignUpMail(email, token, name, callback) {
	let text = ``;
	let subject = "Just one more Step | Maayaa Baazaar";
	let html = `<h3>Hello ${name},</h3>
	<div>Plase Verify Your Email Address By Clicking On The Link Below.</div>
	<div>
		<a href="http://localhost:3000/verifyemail/${email}/${token}">Click Here</a>
	</div>
	<div>Thank You.</div>`;
	sendMail(email, callback, text, subject, html);
}

//Forgot Password Mail
function sendForgotPasswordMail(email, token, callback) {
	let text = ``;
	let subject = "Reset Password | Maayaa Baazaar";
	let html = `<h3>Hello User,</h3>
	<div>Plase Reset Your Password By Clicking On The Link Below.</div>
	<div>
		<a href="http://localhost:3000/resetpassword/${email}/${token}">Click Here</a>
	</div>
	<div>Thank You.</div>`;
	sendMail(email, callback, text, subject, html);
}

//Password Changed Mail
function sendPasswordChangedMail(email, callback) {
	let text = ``;
	let subject = "Password Changed | Maayaa Baazaar";
	let html = `<h3>Hello,</h3>
	<div>Your Password Has Been Changed Successfully.</div>
	<div>If You Have Not Changed Your Password, Please Contact Us.</div>
	<div>Thank You.</div>`;
	sendMail(email, callback, text, subject, html);
}

// async..await is not allowed in global scope, must use a wrapper
async function sendMail(email, callback, text, subject, html) {
	try {
		// send mail with defined transport object
		const info = await transporter.sendMail({
			from: user, // sender address
			to: email, // list of receivers
			subject: subject, // Subject line
			text: text, // plain text body
			html: html, // html body
		});
		console.log("Message sent: %s", info.messageId);
		callback(null, info.messageId);
	} catch (error) {
		//catch error
		console.log(error);
		callback(error, null);
	}
}

//Testing
// sendMail("ssharmapavitra@gmail.com", "log", () => {
// 	console.log("Working");
// }).catch(console.error);

module.exports = {
	sendForgotPasswordMail,
	sendPasswordChangedMail,
	sendSignUpMail,
};
