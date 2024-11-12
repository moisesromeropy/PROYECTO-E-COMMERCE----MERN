var { expressjwt: jwt } = require("express-jwt"); // Importa el módulo express-jwt

// Función de autenticación y autorización JWT
function authJwt() {
    const secret = process.env.JWT_SECRET; // Obtiene la clave secreta para el JWT desde las variables de entorno
    
    // Middleware de autenticación JWT
    const authenticate = jwt({
        secret: secret, // Usa la clave secreta para firmar el JWT
        algorithms: ["HS256"], // Especifica el algoritmo de cifrado HS256 para el JWT
        requestProperty: 'auth' // Propiedad donde se almacenará el payload del JWT en req.auth
    });

    // Middleware de autorización basado en isAdmin
    const authorize = (req, res, next) => {
        if (!req.auth.isAdmin && !req.params.id === req.auth.id) { // Si no es admin y no es el propio usuario
            return res.status(403).json({ message: 'Access Denied: Insufficient Permissions' });
        }
        next();
    };

    // Combina los middlewares de autenticación y autorización
    return [authenticate, authorize];
}

module.exports = authJwt; // Exporta la función authJwt para que pueda ser utilizada en otras partes de la aplicación
