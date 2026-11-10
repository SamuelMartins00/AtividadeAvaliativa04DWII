
const express = require('express');
const router = express.Router();

const relatorioController = require('../controllers/relatorioController');

/**
 * @swagger
 * /relatorios/semanal:
 *   get:
 *     summary: Gerar relatório semanal de cargas e risco de lesão
 *     description: Analisa os treinos realizados entre segunda-feira e domingo da semana correspondente à data informada. Um jogador está em risco quando sua carga semanal ultrapassa estritamente o limite configurado.
 *     tags: [Relatórios]
 *     parameters:
 *       - in: query
 *         name: data
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         example: "2026-11-10"
 *         description: Data utilizada para identificar a semana do relatório, no formato AAAA-MM-DD.
 *     responses:
 *       200:
 *         description: Relatório semanal gerado com sucesso
 *       400:
 *         description: Data ausente ou inválida
 *       404:
 *         description: Configuração semanal não cadastrada
 */
router.get('/semanal', relatorioController.semanal);

module.exports = router;
