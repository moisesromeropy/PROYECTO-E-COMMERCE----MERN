// I. Importaciones necesarias
const express = require('express');
const axios = require('axios');
const router = express.Router();

// II. Endpoint para obtener países
router.get('/countries', async (req, res) => {
  try {
    const response = await axios.get('http://countriesnow.space/api/v0.1/countries/');
    res.json(response.data);
  } catch (error) {
    console.error('Error al obtener los países:', error);
    res.status(500).json({ message: 'Error al obtener los países' });
  }
});

// III. Exportar el router
module.exports = router;
