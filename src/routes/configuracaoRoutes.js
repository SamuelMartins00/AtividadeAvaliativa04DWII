
const express = require('express');
const router = express.Router();

const configuracaoController = require('../controllers/configuracaoController');

router.get('/', configuracaoController.buscar);

router.put('/', configuracaoController.salvar);

module.exports = router;
