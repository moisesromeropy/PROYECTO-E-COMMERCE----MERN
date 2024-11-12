// index.js

// I. Importaciones necesarias
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config(); // Carga las variables de entorno desde el archivo .env
const errorHandler = require('./helper/errorHandler'); // Importa el manejador de errores

// II. Configuración de CORS
const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3003'];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));
app.options('*', cors()); // Habilita las solicitudes OPTIONS para CORS preflight

// // III. Middlewares de seguridad
// app.use(helmet()); // Configura cabeceras HTTP seguras
// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutos
//     max: 100 // Límite de 100 solicitudes por IP
// });
// app.use(limiter); // Aplica el limitador de tasa a todas las solicitudes

// IV. Otros Middlewares
app.use(bodyParser.json()); // Analiza las solicitudes entrantes con carga útil JSON

// V. Importación de rutas
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const homeBannerRoutes = require('./routes/homeBannerRoutes');
const myListRoutes = require('./routes/myListRoutes');
const ordersRoutes = require('./routes/ordersRoutes');
const productRamsRoutes = require('./routes/productRamsRoutes');
const productReviewsRoutes = require('./routes/productReviewsRoutes');
const productSizeRoutes = require('./routes/productSizeRoutes');
const productWeightRoutes = require('./routes/productWeightRoutes');
const searchRoutes = require('./routes/searchRoutes');
const subCategoryRoutes = require('./routes/subCategoryRoutes');
const cartRoutes = require('./routes/cartRoutes');
const imageUploadRoutes = require('./helper/imageUpload');
const productRoutes = require('./routes/productRoutes'); // Añadimos las rutas de productos
const subscriptionRoutes = require('./routes/subscriptionRoutes'); // Asegúrate de que la ruta es correcta

// VI. Configuración de rutas
app.use('/api/user', userRoutes);
app.use('/uploads', express.static('uploads')); // Servir archivos estáticos de la carpeta "uploads"
app.use('/api/category', categoryRoutes);
app.use('/api/homeBanner', homeBannerRoutes);
app.use('/api/my-list', myListRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/productRams', productRamsRoutes);
app.use('/api/productReviews', productReviewsRoutes);
app.use('/api/productSize', productSizeRoutes);
app.use('/api/productWeight', productWeightRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/subcategories', subCategoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/imageUpload', imageUploadRoutes);
app.use('/api/products', productRoutes); // Añadimos las rutas de productos
app.use('/api/subscription', subscriptionRoutes); // Asegúrate de que la ruta es correcta

// VII. Manejo de errores
app.use(errorHandler); // Utiliza el manejador de errores

// VIII. Conexión a la base de datos
mongoose.connect(process.env.DB_LOCAL_URI, {
    
})
    .then(() => {
        console.log('La conexción a la base de datos está lista...');
        // IX. Inicio del servidor
        app.listen(process.env.PORT, () => {
            console.log(`El servidor esta corriendo en el puerto http://localhost:${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });
