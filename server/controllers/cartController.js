// I. Importaciones necesarias
const { Cart } = require('../models/cart');
const  Product  = require('../models/products');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// II. Obtener todos los elementos del carrito
exports.getCart = async (req, res) => {
    console.log("ahora si")
    console.log(req.user.id);
    try {
     
        const cartList = await Cart.find({ userId: req.user.id });
        console.log(cartList);
        if (!cartList) {
            return res.status(500).json({ success: false });
        }
        return res.status(200).json(cartList);
    } catch (error) {
        return res.status(500).json({ success: false });
    }
};

// III. Añadir un nuevo elemento al carrito
exports.addCartItem = async (req, res) => {
    try {
        console.log("holis estoy añadiendo"); // ERROR 500 DICE SER CON EL SERVIDOR SE DEBEN DE VERIFICAR LOS DATOS ENVIADOS
        console.log(req.body);
        const { productId, quantity, image, rating, price,countInStock, productTitle } = req.body;
        console.log(productId, quantity);
        // Verificar si el producto existe y está en stock
        const product = await Product.findById(productId);
        if (!product) {
         
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        if (product.countInStock < quantity) {
       
            return res.status(400).json({ message: 'No hay suficiente stock' });
        }
        console.log("aca entro");
        let cartItem = await Cart.findOne({ productId, userId: req.user.id });

        if (cartItem) {
            cartItem.quantity += quantity;
            cartItem.subTotal = cartItem.quantity * product.price;
        } else {
            cartItem = new Cart({
                productTitle: req.body.productTitle,
                image: req.body.image,
                rating: req.body.rating,
                price: req.body.price,
                productId: req.body.productId,
                countInStock: req.body.countInStock,
                userId: req.body.userId,
                quantity: req.body.quantity,
                subTotal: quantity * req.body.price
            });
        }
        console.log("hasta aca");
        cartItem= await cartItem.save();
        console.log("New item added to MyCart:", cartItem);
        res.status(201).json(cartItem);
    } catch (err) {
        res.status(500).json({ message: 'Error al añadir al carrito', error: err });
    }
};

// IV. Eliminar un elemento del carrito por ID
exports.deleteCartItem = async (req, res) => {
    try {
        const cartItem = await Cart.findById(req.params.id);
        if (!cartItem) {
            return res.status(404).json({ message: 'Elemento del carrito no encontrado' });
        }

        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Elemento eliminado del carrito' });
    } catch (err) {
        res.status(500).json({ message: 'Error al eliminar del carrito', error: err });
    }
};

// V. Obtener un elemento del carrito por ID
exports.getCartItem = async (req, res) => {
    try {
        const cartItem = await Cart.findById(req.params.id);
        if (!cartItem) {
            return res.status(404).json({ message: 'Elemento del carrito no encontrado' });
        }
        res.status(200).json(cartItem);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener el elemento del carrito', error: err });
    }
};

exports.updateCartItem = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        // Validar que se proporciona una cantidad válida
        if (!quantity || quantity < 1) {
            return res.status(400).json({ message: 'La cantidad debe ser mayor a 0' });
        }
        console.log(productId);
        // Verificar que el producto exista y que haya suficiente stock
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        if (product.countInStock < quantity) {
            return res.status(400).json({ message: 'No hay suficiente stock' });
        }

        // Actualizar solo la cantidad y el subtotal
        const updatedCartItem = await Cart.findByIdAndUpdate(
            req.params.id,
            {
                quantity: quantity,
                subTotal: quantity * product.price // Calcula el subtotal con el precio actual del producto
            },
            { new: true }
        );

        // Verificar si el elemento del carrito existe
        if (!updatedCartItem) {
            return res.status(404).json({ message: 'Elemento del carrito no encontrado' });
        }

        res.status(200).json(updatedCartItem);
    } catch (err) {
        console.error('Error al actualizar el elemento del carrito:', err);
        res.status(500).json({ message: 'Error al actualizar el elemento del carrito', error: err });
    }
};


// VII. Procesar el pago
exports.processPayment = async (req, res) => {
    try {
        const { paymentMethodId, shippingAddress } = req.body;
        const userId = req.user.id;

        // Obtener los elementos del carrito del usuario
        const cartItems = await Cart.find({ userId }).populate('productId');
        if (cartItems.length === 0) {
            return res.status(400).json({ message: 'No hay elementos en el carrito' });
        }

        // Calcular el total del pedido
        let totalAmount = 0;
        cartItems.forEach(item => {
            totalAmount += item.subTotal;
        });

        // Crear el pago con Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: totalAmount * 100, // Stripe maneja los montos en centavos
            currency: 'usd',
            payment_method: paymentMethodId,
            confirm: true
        });

        // Crear el pedido en la base de datos
        const newOrder = new Order({
            userId,
            items: cartItems.map(item => ({
                productId: item.productId._id,
                quantity: item.quantity,
                price: item.productId.price,
                subTotal: item.subTotal
            })),
            totalAmount,
            shippingAddress,
            paymentStatus: 'Completado',
            paymentId: paymentIntent.id
        });

        const savedOrder = await newOrder.save();

        // Limpiar el carrito después del pago
        await Cart.deleteMany({ userId });

        res.status(201).json({ order: savedOrder, clientSecret: paymentIntent.client_secret });
    } catch (err) {
        res.status(500).json({ message: 'Error al procesar el pago', error: err });
    }
};
