/*
// I. Importaciones necesarias
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { uploadToCloudinary } = require('../helper/cloudinary');

// II. Función para subir imágenes a Cloudinary
const uploadImages = async (req, res) => {
    try {
        const result = await uploadToCloudinary(req.file.path);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error uploading image" });
    }
};

// III. Función para registrar un nuevo usuario
const signup = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        if (!name || !email || !password || !phone) {
            return res.status(400).json({ message: "Name, email, phone, and password are required" });
        }

        if (name.length < 3) {
            return res.status(400).json({ message: "Name must be at least 3 characters long" });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            phone,
            isAdmin: false // Por defecto, no es admin
        });

        await user.save();

        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_TIME,
        });

        res.status(201).json({ success: true, message: "User registered successfully", token });
    } catch (error) {
        console.error('Error en el backend:', error);
        res.status(500).json({ success: false, message: "Error registering user" });
    }
};
// IV. Función para iniciar sesión
const signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found. Please register.", registerLink: "/signup" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_TIME,
        });

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin
            }
        });
    } catch (error) {
        console.error('Error en el backend:', error);
        res.status(500).json({ success: false, message: "Error signing in" });
    }
};
// V. Función para cambiar la contraseña del usuario
const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: "Old password and new password are required" });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Old password is incorrect" });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.status(200).json({ success: true, message: "Password changed successfully" });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status  (500).json({ success: false, message: "Error changing password" });
    }
};
// VI. Función para obtener todos los usuarios
const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching users" });
    }
};

// VII. Función para obtener un usuario por ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching user" });
    }
};

// VIII. Función para eliminar un usuario por ID
const deleteUserById = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting user" });
    }
};

// IX. Función para obtener el conteo de usuarios
const getUserCount = async (req, res) => {
    try {
        const count = await User.countDocuments();
        res.status(200).json({ success: true, count });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching user count" });
    }
};

// X. Función para actualizar un usuario por ID
const updateProfile = async (req, res) => {
    try {
        const { name, phone } = req.body;

        if (!name || !phone) {
            return res.status(400).json({ message: "Name and phone are required" });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.name = name;
        user.phone = phone;
        await user.save();

        res.status(200).json({ success: true, message: "Profile updated successfully", user });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ success: false, message: "Error updating profile" });
    }
};

// XI. Función para eliminar una imagen de Cloudinary
const deleteImage = async (req, res) => {
    // Lógica para eliminar una imagen de Cloudinary
};

// XII. Exportaciones
module.exports = {
    uploadImages,
    signup,
    signin,
    changePassword,
    getUsers,
    getUserById,
    deleteUserById,
    getUserCount,
    updateProfile,
    deleteImage
};*/
// I. Importaciones necesarias
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { uploadToCloudinary } = require('../helper/cloudinary');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// II. Función para subir imágenes a Cloudinary
const uploadImages = async (req, res) => {
    try {
        const result = await uploadToCloudinary(req.file.path);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error uploading image" });
    }
};

// III. Función para registrar un nuevo usuario
const signup = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        if (!name || !email || !password || !phone) {
            return res.status(400).json({ message: "Name, email, phone, and password are required" });
        }

        if (name.length < 3) {
            return res.status(400).json({ message: "Name must be at least 3 characters long" });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            phone,
            isAdmin: false // Por defecto, no es admin
        });

        await user.save();

        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_TIME,
        });

        res.status(201).json({ success: true, message: "User registered successfully", token });
    } catch (error) {
        console.error('Error en el backend:', error);
        res.status(500).json({ success: false, message: "Error registering user" });
    }
};

// IV. Función para iniciar sesión
const signin = async (req, res) => {
    try {
        
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found. Please register.", registerLink: "/signup" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_TIME,
        });

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin
            }
        });
    } catch (error) {
        
        console.error('Error en el backend:', error);
        res.status(500).json({ success: false, message: "Error signing in" });
    }
};

// V. Función para cambiar la contraseña del usuario
const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: "Old password and new password are required" });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Old password is incorrect" });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.status(200).json({ success: true, message: "Password changed successfully" });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ success: false, message: "Error changing password" });
    }
};

// VI. Función para obtener todos los usuarios
const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching users" });
    }
};

// VII. Función para obtener un usuario por ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching user" });
    }
};

// VIII. Función para eliminar un usuario por ID
const deleteUserById = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting user" });
    }
};

// IX. Función para obtener el conteo de usuarios
const getUserCount = async (req, res) => {
    try {
        const count = await User.countDocuments();
        res.status(200).json({ success: true, count });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching user count" });
    }
};

// X. Función para actualizar un usuario por ID
const updateProfile = async (req, res) => {
    try {
        const { name, phone } = req.body;

        if (!name || !phone) {
            return res.status(400).json({ message: "Name and phone are required" });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.name = name;
        user.phone = phone;
        await user.save();

        res.status(200).json({ success: true, message: "Profile updated successfully", user });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ success: false, message: "Error updating profile" });
    }
};

// XI. Función para eliminar una imagen de Cloudinary
const deleteImage = async (req, res) => {
    // Lógica para eliminar una imagen de Cloudinary
};

// XII. Funciones de recuperación de contraseña

// Configuración de nodemailer para Mailtrap
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});
/*
// Función para generar un código aleatorio
const generateRandomCode = () => {
    return Math.random().toString(36).substring(2, 18).toUpperCase();
};

// Nueva función para manejar la solicitud de recuperación de contraseña
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generar un token aleatorio
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

        // Guardar el token en el usuario
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpire = Date.now() + 3600000; // 1 hora para expirar
        await user.save();

        // Configurar el transporte de correo
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_MAIL,
                pass: process.env.SMTP_PASS,
            },
        });

        // Configurar el correo electrónico
        const message = {
            from: process.env.SMTP_FROM_EMAIL,
            to: email,
            subject: 'Password Reset Request',
            text: `You have requested a password reset. Please make a put request to: \n\n ${resetUrl}`,
        };

        await transporter.sendMail(message);

        res.status(200).json({ success: true, message: 'Email sent' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: 'Error sending email' });
    }
};

// Nueva función para manejar el restablecimiento de la contraseña
const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        // Actualizar la contraseña
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(200).json({ success: true, message: "Password reset successfully" });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ success: false, message: 'Error resetting password' });
    }
};
*/
// XIII. Exportaciones
module.exports = {
    uploadImages,
    signup,
    signin,
    changePassword,
    getUsers,
    getUserById,
    deleteUserById,
    getUserCount,
    updateProfile,
    deleteImage
};

