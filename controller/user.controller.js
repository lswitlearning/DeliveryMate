const User = require("../model/user.model")
const generateAccessToken = require("../utils/generateToken")
const bcrypt = require("bcrypt")
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');


const postUser = async (req, res, next) => {
    let userdata = req.body
    userdata.password = await bcrypt.hash(userdata.password, 10)
    try {
        const user = new User(userdata)
        const validationUser = await user.validate()
        let data = await user.save()

        if (data) {
            const token = await generateAccessToken(data._id)
            data = { ...data.toJSON(), token }
            return res.json({ statusCode: 200, data, message: 'success' });
        }
    }
    catch (err) {
        next(err)

    }
}

const loginUser = async (req, res, next) => {
    try {
        const userData = await User.findOne({ username: req.body.username })
        if (userData) {
            const verifyPassword = await bcrypt.compare(req.body.password, userData.password)
            if (verifyPassword) {
                return res.json({
                    statusCode: 200, data: {
                        token: generateAccessToken(userData._id)
                    }, message: 'success'
                })
            }
            next('Wrong Credentials')
        } else {
            next('No such user')
        }
    } catch (err) {
        next(err)
    }
}

const getUsers = async (req, res, next) => {
    try {
        let data = await User.find({})
        if (data) {
            return res.json({ statusCode: 200, data, message: 'success' });
        }
    }
    catch (err) {
        next(err)
    }
}

const getCurrentUser = async (req, res, next) => {
    try {
        let data = await User.findById(req.user.id)
        if (data) {
            return res.json({ statusCode: 200, data, message: 'success' });
        }
    }
    catch (err) {
        next(err)
    }
}
// for editing user data
const changeUserDetails = async (req, res, next) => {
    const { newFirstname, newLastname, newEmail, newPhone } = req.body;
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);

        user.firstname = newFirstname;
        user.lastname = newLastname;
        user.email = newEmail;
        user.phonenumber = newPhone;

        await user.save();

        return res.json({ message: "User details updated successfully" });
    }
    catch (error) {
        next(error);
    }
}

// for changing password
const changePassword = async (req, res, next) => {
    const { currentPassword, newPassword,forgot } = req.body;
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);
        if(!forgot){
            const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
            if (!isPasswordValid) {
                return res.statusCode(400).json({ message: "Current password is incorrect" });
            }
        }
       
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        return res.json({ message: 'Password updated successfully.' });
    } catch (error) {
        next(error)
    }
};




const transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 465, // Use port 465 for SSL
    secure: true, // Use SSL
    auth: {
        user: 'apikey',
        pass: process.env.EMAIL_TOKEN,
    },
});

const requestPasswordReset = async (req, res, next) => {
    const { email } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        let resetToken = generateAccessToken(user._id)
        // Send email with reset link
        const resetLink = `http://localhost:3000/reset-password/?token=${resetToken}`;
        const mailOptions = {
            from: 'eswarssethu2002@gmail.com',
            to: email,
            subject: 'Password Reset Request',
            html: `Click the following link to reset your password:<a href='${resetLink}'>Click Here <a/>`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ message: 'Error sending email' });
            }
            console.log('Email sent:', info.response);
            return res.json({ message: 'Password reset email sent successfully' });
        });


    } catch (error) {
        console.error(error);
        return next(error);
    }
};






module.exports = { postUser, getUsers, loginUser, getCurrentUser, changePassword, changeUserDetails, requestPasswordReset }