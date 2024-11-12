// I. Importación del modelo Orders
const { Orders } = require('../models/orders');

// II. Obtener todas las órdenes
exports.getOrders = async (req, res) => {
    try {
        const ordersList = await Orders.find(req.query); // Busca todas las órdenes según los parámetros de consulta

        if (!ordersList) {
            return res.status(500).json({ success: false });
        }

        return res.status(200).json(ordersList); // Devuelve la lista de órdenes
    } catch (error) {
        return res.status(500).json({ success: false });
    }
};

// III. Obtener una orden por ID
exports.getOrderById = async (req, res) => {
    const order = await Orders.findById(req.params.id); // Busca una orden por ID

    if (!order) {
        return res.status(500).json({ message: 'La orden con el ID proporcionado no fue encontrado' });
    }
    return res.status(200).send(order); // Devuelve la orden encontrada
};

// // IV. Obtener el conteo de órdenes
// exports.getOrderCount = async (req, res) => {
//     const orderCount = await Orders.countDocuments(); // Cuenta el número total de órdenes

//     if (!orderCount) {
//         return res.status(500).json({ success: false });
//     } else {
//         return res.send({
//             orderCount: orderCount
//         });
//     }
// };

// V. Crear una nueva orden
exports.createOrder = async (req, res) => {
    let order = new Orders({
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
        address: req.body.address,
        pincode: req.body.pincode,
        amount: req.body.amount,
        paymentId: req.body.paymentId,
        email: req.body.email,
        userid: req.body.userid,
        products: req.body.products,
    });

    if (!order) {
        return res.status(500).json({
            error: err,
            success: false
        });
    }

    order = await order.save(); // Guarda la nueva orden en la base de datos
    return res.status(201).json(order); // Devuelve la nueva orden creada
};

// VI. Eliminar una orden por ID
exports.deleteOrderById = async (req, res) => {
    const deletedOrder = await Orders.findByIdAndDelete(req.params.id); // Elimina la orden de la base de datos por ID

    if (!deletedOrder) {
        return res.status(404).json({
            message: 'Orden no encontrada',
            success: false
        });
    }

    return res.status(200).json({
        success: true,
        message: 'Orden Eliminada'
    });
};

// VII. Actualizar una orden por ID
exports.updateOrderById = async (req, res) => {
    const order = await Orders.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            phoneNumber: req.body.phoneNumber,
            address: req.body.address,
            pincode: req.body.pincode,
            amount: req.body.amount,
            paymentId: req.body.paymentId,
            email: req.body.email,
            userid: req.body.userid,
            products: req.body.products,
            status: req.body.status
        },
        { new: true }
    );

    if (!order) {
        return res.status(500).json({
            message: 'La orden no pudo ser actualizada',
            success: false
        });
    }

    return res.send(order); // Devuelve la orden actualizada
};
