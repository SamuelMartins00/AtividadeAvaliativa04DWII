
const treinoService = require('../services/treinoService');

class TreinoController {

    async criar(req, res, next) {
        try {
            const treino = await treinoService.criar(req.body);

            return res.status(201).json({
                mensagem: 'Treino cadastrado com sucesso.',
                treino
            });

        } catch (error) {
            next(error);
        }
    }

    async listar(req, res, next) {
        try {
            const treinos = await treinoService.listar();

            return res.status(200).json(treinos);

        } catch (error) {
            next(error);
        }
    }

    async listarPorJogador(req, res, next) {
        try {
            const treinos = await treinoService.listarPorJogador(
                req.params.id
            );

            return res.status(200).json(treinos);

        } catch (error) {
            next(error);
        }
    }

    async excluir(req, res, next) {
        try {
            const treino = await treinoService.excluirPorCodigo(
                req.params.codigo
            );

            return res.status(200).json({
                mensagem: 'Treino excluído com sucesso.',
                treino
            });

        } catch (error) {
            next(error);
        }
    }
}

module.exports = new TreinoController();
