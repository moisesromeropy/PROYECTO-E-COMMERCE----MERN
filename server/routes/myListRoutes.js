// I. Importaciones necesarias
const { MyList } = require('../models/myList'); // Importa el modelo MyList
const express = require('express'); // Importa express
const router = express.Router(); // Crea una instancia del router de express

// II. Definición de Rutas

// 1. Ruta para obtener todos los elementos de MyList
router.get('/', async (req, res) => {

    try {
        const myList = await MyList.find({

            userId: req.query.userId
        }).populate('userId'); // Poblar los datos de los modelos referenciados

        if (!myList || myList.length === 0) {
            console.error("No items found in MyList");
            return res.status(404).json({ success: false, message: "No items found" }); // Si no se encuentra ningún elemento, responde con un error 404
        }

        return res.status(200).json(myList); // Si se encuentran elementos, responde con un estado 200 y los datos
    } catch (error) {
        console.error("Error fetching MyList:", error);
        res.status(500).json({ success: false, message: error.message }); // Maneja errores y responde con un estado 500
    }
});

// 2. Ruta para agregar un nuevo elemento a MyList
router.post('/add', async (req, res) => {
    try {
        console.log("Request body:", req.body);
        const item = await MyList.find({ productId: req.body.productId, userId: req.body.userId }); // Busca si el producto ya existe en la lista del usuario

        if (item.length === 0) {
            let list = new MyList({
                productTitle: req.body.productTitle,
                image: req.body.image,
                rating: req.body.rating,
                price: req.body.price,
                productId: req.body.productId,
                userId: req.body.userId
            });

            list = await list.save(); // Guarda el nuevo elemento en la base de datos
            console.log("New item added to MyList:", list);

            return res.status(201).json(list); // Responde con un estado 201 y el elemento creado
        } else {
            console.warn("Product already in MyList:", req.body.productId);
            return res.status(401).json({ status: false, msg: "Product already added in the My List" }); // Si el producto ya existe en la lista, responde con un estado 401
        }
    } catch (error) {
        console.error("Error adding to MyList:", error);
        res.status(500).json({ success: false, error: error.message }); // Maneja errores y responde con un estado 500
    }
});

// 3. Ruta para eliminar un elemento de MyList por ID
router.delete('/:id', async (req, res) => {
    try {
        const item = await MyList.findById(req.params.id); // Busca el elemento por ID

        if (!item) {
            console.warn("Item not found:", req.params.id);
            return res.status(404).json({ msg: "The item with the given id is not found!" }); // Si no se encuentra el elemento, responde con un estado 404
        }

        const deletedItem = await MyList.findByIdAndDelete(req.params.id); // Elimina el elemento por ID
        console.log("Item deleted:", deletedItem);

        return res.status(200).json({
            success: true,
            message: 'Item Deleted!'
        }); // Responde con un estado 200 y un mensaje de éxito
    } catch (error) {
        console.error("Error deleting item from MyList:", error);
        res.status(500).json({ success: false, error: error.message }); // Maneja errores y responde con un estado 500
    }
});

// 1. Ruta para obtener todos los elementos de MyList
router.get('/filtrado', async (req, res) => {

    try {
        const { productId, userId } = req.query;
        // Filtra MyList usando ambos criterios
        const myList = await MyList.find({
            productId: productId,
            userId: userId
        }).populate('productId').populate('userId');

        if (!myList || myList.length === 0) {
            console.error("No items found in MyList");
            return res.status(404).json({ success: false, message: "No items found" }); // Si no se encuentra ningún elemento, responde con un error 404
        }

        return res.status(200).json(myList); // Si se encuentran elementos, responde con un estado 200 y los datos
    } catch (error) {
        console.error("Error fetching MyList:", error);
        res.status(500).json({ success: false, message: error.message }); // Maneja errores y responde con un estado 500
    }
});


// III. Exportacion del Router
module.exports = router;
