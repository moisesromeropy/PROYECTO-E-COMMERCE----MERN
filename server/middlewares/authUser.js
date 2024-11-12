// Importación de JWT
const jwt = require('jsonwebtoken');

// Middleware para verificar si el usuario está autenticado
exports.verifyToken = (req, res, next) => {
    // 1. Obtener el token de la cabecera 'Authorization'
    console.log("hola");
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access Denied: No Token Provided' });
    }

    try {
        // 2. Verificar el token usando la clave secreta JWT
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Guardamos la información del usuario en `req.user`
        
        console.log("User verified:", req.user);
        next(); // Continuar con el siguiente middleware o controlador
    } catch (err) {
        console.log("Invalid token");
        res.status(400).json({ message: 'Invalid Token' });
    }
};

