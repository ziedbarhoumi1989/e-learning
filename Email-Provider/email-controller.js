const MailClient = require('nodemailer');
const MailSettings = require('./email-config.js');
const User = require('../User/user-controller');
const _RegistrationToken = require('../Utilities/token-model');
const TokenUtils = require('../Utilities/token-provider');

let Transporter = MailClient.createTransport(MailSettings.account.smtp);

module.exports.sendEmail = (message) => {

    Transporter.sendMail(message, (error, info) => {
        if (error) {
            console.log("Error Sending Mail - " + error);
            return false;
        }

        else {
            console.log("Mail Sent!");
            console.log('Preview URL: ' + MailClient.getTestMessageUrl(info));
            return true;
        }
    });
};

module.exports.sendRegistrationToken = (email, callback) => {

    let RegistrationToken = new _RegistrationToken({

       token: TokenUtils.generateRegistrationToken(),
       status: "Active"

    });


    let message = {

        to: email,
        subject: "Teacher Registration Token",
        text: "Please use the following registration token: \n " + RegistrationToken.token
    };

    this.sendEmail(message);

    RegistrationToken.save((error, token) => {

        if(error) {
            console.log(error);
            return false;
        }
        else return true;

    });

};

module.exports.createMessage = (recipient, subject, body) => {
    return { to: recipient, subject: subject, text: body }; };


this.sendRegistrationToken("test@test.com");


