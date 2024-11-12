


FALTA ACTUALZAR 13-07-2024



# E-commerce Backend

Este proyecto es el backend de una tienda en línea, diseñado para gestionar usuarios, productos, categorías, carritos de compras. Está construido utilizando Node.js, Express, MongoDB. A continuación se detallan las características y funcionalidades implementadas.

## Características

### Usuarios
- Registro de usuarios (`signup`)
- Inicio de sesión (`signin`)
- Cambiar contraseña (`changePassword`)
- Obtener todos los usuarios
- Obtener un usuario por ID
- Eliminar un usuario por ID
- Contar el número total de usuarios
- Actualizar la información del usuario
- Carga de imágenes de usuario con Cloudinary

### Productos
- Crear un nuevo producto
- Obtener todos los productos
- Obtener un producto por ID
- Actualizar un producto por ID
- Eliminar un producto por ID

### Categorías
- Crear una nueva categoría
- Obtener todas las categorías
- Obtener una categoría por ID
- Actualizar una categoría por ID
- Eliminar una categoría por ID

### Carrito de Compras
- Agregar un producto al carrito
- Obtener todos los productos del carrito del usuario actual
- Actualizar la cantidad de un producto en el carrito
- Eliminar un producto del carrito
- Procesar el pago con Stripe


### Middleware de Seguridad
- Autenticación y autorización con JWT
- Seguridad de cabeceras HTTP con Helmet
- Limitador de tasa de solicitudes con express-rate-limit



Autores:
MLRC
moisesromeropy



Este `README.md` proporciona una visión general completa del backend de tu proyecto e-commerce.