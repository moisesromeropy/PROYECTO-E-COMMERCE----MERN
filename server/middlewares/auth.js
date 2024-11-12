//I. Importaciones necesarias
const jwt = require('jsonwebtoken');

// II. Middleware para verificar el token y el rol del usuario
exports.verifyTokenAndRole = (roles) => {
    return (req, res, next) => {
        //1,  Obtención del token de la cabecera 'Authorization'
        const authHeader = req.header('Authorization');
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Access Denied: No Token Provided' });
        }

        try {
            // 2. Verificación del token usando la clave secreta JWT
            const verified = jwt.verify(token, process.env.JWT_SECRET);
            console.log(verified);
            req.user = verified;

            console.log("User verified:", req.user);

            // 3. Verificación del rol del usuario
            if (!req.user.isAdmin) {
                console.log("Insufficient permissions");
                return res.status(403).json({ message: 'Access Denied: Insufficient Permissions' });
            }
            console.log("llegó")
            next();
        } catch (err) {
            console.log("Invalid token");
            res.status(400).json({ message: 'Invalid Token' });
        }
    };
};

