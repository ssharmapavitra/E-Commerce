"use strict";
const nodemailer = require("nodemailer");

let user = "xxxxxxxxxxxxxxxxxxx";
let pass = "yyyyyyyyyyyyyyyyyyyyyyy";

const transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 587,
	secure: false, // true for 465, false for other ports
	auth: {
		user: user,
		pass: pass,
	},
});

// async..await is not allowed in global scope, must use a wrapper
async function sendMail(email, token, name, callback) {
	try {
		// send mail with defined transport object
		const info = await transporter.sendMail({
			from: user, // sender address
			to: email, // list of receivers
			subject: "Just one more Step | Maayaa Baazaar", // Subject line
			text: "", // plain text body
			html: `<h3>Hello ${name},</h3>
			<div>Plase Verify Your Email Address By Clicking On The Link Below.</div>
			<div>
				<a href="http://localhost:3000/verifyemail/${email}/${token}">Click Here</a>
			</div>
			<div>Thank You.</div>`, // html body
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

module.exports = sendMail;
