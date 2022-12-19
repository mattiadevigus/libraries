/*
    Project: VGSEmail
    Author: Mattia Devigus
    This library works with Gmail Service
    For other SMTP transport watch https://nodemailer.com/smtp/
*/

//ENV
//email=youremail
//token=yourtoken

conssssssole.log("VGS Email 0.0.2");

const fs = require("fs");

const path = require("path");
const nodemailer = require("nodemailer");
const formidable = require('formidable');

const email = process.env.EMAIL;
const pass = process.env.TOKEN;

// Send simple mail with text
exports.sendEmail = (fields) => {
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: email,
            pass: pass
        }
    });

    const mailOptions = {
        from: fields.email,
        to: email,
        subject: "Your Subject",
        html: `<h5>Write here your email structure. You can also include variables ${x}</h5>`,
    }

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) throw err;

        console.log("Email sent");
    })
}

// Send email with uploaded file using formidable
exports.uploadFile = (req, res) => {
    const form = new formidable.IncomingForm();
    form.multiples = true;
    form.uploadDir = path.join(__dirname, "../attachments");
    form.maxFileSize = 50 * 1024 * 1024;

    form.parse(req, (err, fields, files) => {
        if (err) throw err;

        const file = files.fileToUpload;
        console.log(file.originalFilename);

        const fileName = encodeURIComponent(file.originalFilename.replace(/\s/g, "-"));
        const newUrl = path.join(__dirname, "../attachments/") + fileName;

        try {
            fs.renameSync(file.filepath, newUrl);
        } catch (err) {
            console.log(err);
        }

        sendEmail(fields, fileName, newUrl);
    })

    const sendEmail = (fields, file, url) => {
        const x = "Variable value";

        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: email,
                pass: pass
            }
        });

        const mailOptions = {
            from: fields.email,
            to: email,
            subject: "Your Subject",
            html: `<h5>Write here your email structure. You can also include variables ${x}</h5>`,
            attachments: [{
                filename: file,
                path: url
            }]
        }

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) throw err;

            console.log("Email sent");
        })
    }
}