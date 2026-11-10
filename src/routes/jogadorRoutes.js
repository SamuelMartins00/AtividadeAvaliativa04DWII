const express = require('express');
const router = express.Router();

const jogadorController = require('../controllers/jogadorController');

/**
 * @swagger
 * /jogadores:
 *   post:
 *     summary: Cadastrar um novo jogador
 *     tags: [Jogadores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - posicao
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Carlos Silva
 *               posicao:
 *                 type: string
 *                 enum: [G, Z, M, A]
 *                 example: M
 *     responses:
 *       201:
 *         description: Jogador cadastrado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/', jogadorController.criar);


/**
 * @swagger
 * /jogadores:
 *   get:
 *     summary: Listar todos os jogadores
 *     tags: [Jogadores]
 *     responses:
 *       200:
 *         description: Lista de jogadores
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/', jogadorController.listar);

/**
 * @swagger
 * /jogadores/{id}:
 *   get:
 *     summary: Buscar jogador pelo ID
 *     tags: [Jogadores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identificador do jogador
 *     responses:
 *       200:
 *         description: Jogador encontrado
 *       404:
 *         description: Jogador não encontrado
 */
router.get('/:id', jogadorController.buscarPorId);

/**
 * @swagger
 * /jogadores/{id}:
 *   put:
 *     summary: Atualizar dados de um jogador
 *     tags: [Jogadores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Carlos Silva
 *               posicao:
 *                 type: string
 *                 enum: [G, Z, M, A]
 *                 example: A
 *     responses:
 *       200:
 *         description: Jogador atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Jogador não encontrado
 */
router.put('/:id', jogadorController.atualizar);

/**
 * @swagger
 * /jogadores/{id}/desativar:
 *   patch:
 *     summary: Desativar um jogador
 *     description: Desativa o jogador sem excluir seu histórico de treinos.
 *     tags: [Jogadores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Jogador desativado com sucesso
 *       404:
 *         description: Jogador não encontrado
 */
router.patch('/:id/desativar', jogadorController.desativar);

module.exports = router;