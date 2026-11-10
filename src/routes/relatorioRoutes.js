
const express = require('express');
const router = express.Router();

const relatorioController = require('../controllers/relatorioController');

router.get('/semanal', relatorioController.semanal);

module.exports = router;
