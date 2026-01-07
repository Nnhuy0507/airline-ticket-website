const nodemailer = require('nodemailer');
const {v4: uuidv4} = require('uuid');
const bcrypt = require('bcryptjs');
const userVerification = require('../models/UserVerification');
const {mongooseToObject} = require('../util/mongoose')

class UserVerificationService{
    async findByUserId(userID){
        return await userVerification.findOne({userID})
        .then((result)=>{
            return mongooseToObject(result);
        })
        .catch((error)=>{
            console.log(error);
        })
    }
    async delUserVerification(userID) {
        try {
            await userVerification.deleteOne({ userID });
            return { status: 200, message: "Deleted UserVerification successful." };
        } catch (error) {
            return { status: 400, message: "There was an error while deleting the UserVerification." };
        }
    }
    
    
    
    // sending mail register using nodemailer
    
    sendVerificationEmail = ({_id, email}, res) => {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.AUTH_EMAIL,
                pass: process.env.PASSWORD
            }
        });
        const currentUrl = `http://localhost:${process.env.PORT}`;
        const uniqueString = uuidv4() + _id;
    
        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: "[Tanka Travel] Verify Your Email",
            html: `<p>Verify your email address to complete the signup and login into your account.</p>
            <p>Press <a href=${currentUrl + "/verify/" + _id + "/" + uniqueString}> here </a> to proceed. </p>`
        }
        // hashed uniqueString
        bcrypt
        .hash(uniqueString, 10)
        .then((hasedUniqueString) => {
            const newUserVerification = new userVerification({
                userID: _id,
                uniqueString: hasedUniqueString,
                createdAt: Date.now(),
                expiredAt: Date.now() + 21600000
            })
            newUserVerification
                .save()
                .then(async ()=>{
                    try{
                        await transporter.sendMail(mailOptions);
                        console.log(`Verification mail has been sent to ${mailOptions.to}`);
                        res.render('pages/authentication/login', {
                            layout: null,
                            success: "An email has been sent into your email address. Please verify before login."
                        });     
                    }
                    catch{
                        return ({
                            status: "FAILED",
                            message: "An error occurred while sending email."
                        })
                    }
                
                    })
                })
                .catch((error)=>{
                    console.log(error);
                    return ({
                        status: "FAILED",
                        message: "An error occurred while sending email."
                    })
                })
        .catch((error)=>{
            console.log(error);
            return ({
                status: "FAILED",
                message: "An error occurred while sending email."
            })
        })
    }

    // sending mail resetpassword using nodemailer
    sendCodeResetPassword = async ({ _id, email }) => {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.AUTH_EMAIL,
                pass: process.env.PASSWORD
            }
        });
        const currentUrl = `http://localhost:${process.env.PORT}`;
        const uniqueString = uuidv4() + _id;
    
        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: "[Tanka Travel] Reset Your Password",
            html: `<p>We've processed your password change request. If it is you who sent this request, click on the link below to change your password.</p>
            <p>Press <a href=${currentUrl + "/changepassword/" + _id + "/" + uniqueString}> here </a> to proceed. </p>`
        };
        
        const userVerificationData = await this.findByUserId(_id);
    
        if (!userVerificationData) {
            try {
                const hashedUniqueString = await bcrypt.hash(uniqueString, 10);
                const newUserVerification = new userVerification({
                    userID: _id,
                    uniqueString: hashedUniqueString,
                    createdAt: Date.now(),
                    expiredAt: Date.now() + 21600000
                });
    
                await newUserVerification.save();
                await transporter.sendMail(mailOptions);
                console.log(`Password request mail has been sent to ${mailOptions.to}`);
                
                return { status: 200, message: `Password reset mail has been sent to ${mailOptions.to}.` };
            } catch (error) {
                console.error(error);
                return { status: 500, message: "An error occurred while processing the request." };
            }
        } else {
            return { status: 400, message: "You have sent a request before. Please check your email address." };
        }
    }
    
}


module.exports = new UserVerificationService;


