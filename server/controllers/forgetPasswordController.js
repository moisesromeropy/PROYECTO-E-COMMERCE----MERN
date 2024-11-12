const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const User = require('../models/user');

const forgotPassword = async (req, res) => {
    // Logic for forget password
    try {
        // Find the user by email
        const user = await User.findOne({ email: req.body.email });
    
        // If user not found, send error message
        if (!user) {
          return res.status(404).send({ message: "User no encontrado" });
        }
    
        // Generate a unique JWT token for the user that contains the user's id
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {expiresIn: "10m",});
    
        // Send the token to the user's email
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_MAIL,
                pass: process.env.SMTP_PASS,
            },
        });
    
        // Email configuration
        //Si se despliga es necesario cambias el localhost:3000
        const mailOptions = {
          from: process.env.SMTP_FROM_EMAIL,
          to: req.body.email,
          subject: "Reset Password",
          html: `<h1>Restablecer tu Contraseña</h1>
                <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
                <a href="http://localhost:3000/reset-password/${token}">http://localhost:5173/reset-password/${token}</a>
                <p>El enlace expirará en 10 minutos.</p>
                <p>Si no solicitaste un restablecimiento de contraseña, por favor ignora este correo electrónico.</p>`,
        };
    
        // Send the email
        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            return res.status(500).send({ message: err.message });
          }
          res.status(200).send({ message: "Email enviado" });
        });
      } catch (err) {
        res.status(500).send({ message: err.message });
      }
};

const resetPassword = async (req, res) => {
    // Logic for reset password
    try {
        // Verify the token sent by the user
        const decodedToken = jwt.verify(
          req.params.token,
          process.env.JWT_SECRET
        );
        const { newPassword } = req.body;
        console.log(newPassword);
        console.log(decodedToken);
        // If the token is invalid, return an error
        if (!decodedToken) {
          return res.status(401).send({ message: "Token invalido" });
        }
    
        // find the user with the id from the token
        const user = await User.findOne({ _id: decodedToken.userId });
        console.log(user);
        if (!user) {
          return res.status(401).send({ message: "no user found" });
        }
        
        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        // Update user's password, clear reset token and expiration time
        await user.save();
    
        // Send success response
        res.status(200).send({ message: "Password updated" });
      } catch (err) {
        // Send error response if any error occurs
        res.status(500).send({ message: err.message });
      }
};
module.exports = {
    forgotPassword,
    resetPassword
};
