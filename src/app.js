
const express = require('express');

const app = express();

// Middleware para interpretar JSON
app.use(express.json());

// Rota inicial para verificar a API
app.get('/', (req, res) => {
    return res.status(200).json({
        mensagem: 'API - Treinos Esportivos funcionando!'
    });
});

module.exports = app;
