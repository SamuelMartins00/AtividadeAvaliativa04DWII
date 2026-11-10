
const express = require('express');
const router = express.Router();

const configuracaoController = require('../controllers/configuracaoController');

/**
 * @swagger
 * /configuracao:
 *   get:
 *     summary: Consultar configuração da carga máxima semanal
 *     tags: [Configuração]
 *     responses:
 *       200:
 *         description: Configuração encontrada
 *       404:
 *         description: Configuração ainda não cadastrada
 */
router.get('/', configuracaoController.buscar);

/**
 * @swagger
 * /configuracao:
 *   put:
 *     summary: Cadastrar ou atualizar a carga máxima semanal
 *     tags: [Configuração]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cargaMaximaSemanal
 *             properties:
 *               cargaMaximaSemanal:
 *                 type: number
 *                 example: 300
 *               dataVigencia:
 *                 type: string
 *                 format: date
 *                 nullable: true
 *                 example: "2026-11-10"
 *     responses:
 *       200:
 *         description: Configuração salva com sucesso
 *       400:
 *         description: Valor de carga inválido
 */
router.put('/', configuracaoController.salvar);

module.exports = router;
