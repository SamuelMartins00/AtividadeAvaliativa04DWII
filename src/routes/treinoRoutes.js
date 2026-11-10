
const express = require('express');
const router = express.Router();

const treinoController = require('../controllers/treinoController');

/**
 * @swagger
 * /treinos:
 *   post:
 *     summary: Cadastrar um novo treino
 *     description: Calcula automaticamente a carga do treino conforme sua duração, intensidade e tipo.
 *     tags: [Treinos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - codigo
 *               - jogadorId
 *               - dataTreino
 *               - tipo
 *               - duracaoMin
 *               - intensidade
 *             properties:
 *               codigo:
 *                 type: string
 *                 example: TREINO-001
 *               jogadorId:
 *                 type: integer
 *                 example: 101
 *               dataTreino:
 *                 type: string
 *                 format: date
 *                 example: "2026-11-10"
 *               tipo:
 *                 type: string
 *                 enum: [F, T, E]
 *                 example: F
 *               duracaoMin:
 *                 type: integer
 *                 example: 60
 *               intensidade:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 10
 *                 example: 8
 *     responses:
 *       201:
 *         description: Treino cadastrado com sucesso
 *       400:
 *         description: Dados inválidos ou jogador inativo
 *       404:
 *         description: Jogador não encontrado
 *       409:
 *         description: Código de treino já cadastrado
 */
router.post('/', treinoController.criar);

/**
 * @swagger
 * /treinos:
 *   get:
 *     summary: Listar treinos com filtros opcionais
 *     description: Permite combinar filtros por jogador, tipo e período.
 *     tags: [Treinos]
 *     parameters:
 *       - in: query
 *         name: jogadorId
 *         schema: { type: integer, minimum: 1 }
 *       - in: query
 *         name: tipo
 *         schema: { type: string, enum: [F, T, E] }
 *       - in: query
 *         name: dataInicio
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: dataFim
 *         schema: { type: string, format: date }
 *     responses:
 *       200:
 *         description: Lista de treinos com os respectivos jogadores
 *       400:
 *         description: Filtros inválidos
 */
router.get('/', treinoController.listar);

/**
 * @swagger
 * /treinos/jogador/{id}:
 *   get:
 *     summary: Listar treinos de um jogador específico
 *     tags: [Treinos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do jogador
 *     responses:
 *       200:
 *         description: Lista de treinos do jogador
 *       404:
 *         description: Jogador não encontrado
 */
router.get('/jogador/:id', treinoController.listarPorJogador);

/**
 * @swagger
 * /treinos/{codigo}:
 *   delete:
 *     summary: Excluir um treino pelo código
 *     tags: [Treinos]
 *     parameters:
 *       - in: path
 *         name: codigo
 *         required: true
 *         schema:
 *           type: string
 *         description: Código do treino
 *     responses:
 *       200:
 *         description: Treino excluído com sucesso
 *       404:
 *         description: Treino não encontrado
 */
router.delete('/:codigo', treinoController.excluir);

module.exports = router;
