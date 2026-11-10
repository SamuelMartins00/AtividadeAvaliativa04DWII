
const express = require('express');
const router = express.Router();

const treinoController = require('../controllers/treinoController');

router.post('/', treinoController.criar);

router.get('/', treinoController.listar);

router.get('/jogador/:id', treinoController.listarPorJogador);

router.delete('/:codigo', treinoController.excluir);

module.exports = router;
