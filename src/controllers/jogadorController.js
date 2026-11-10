const jogadorService = require('../services/jogadorService');

class JogadorController {

    async criar(req, res, next) {
        try {
            const jogador = await jogadorService.criar(req.body);

            return res.status(201).json({
                mensagem: 'Jogador cadastrado com sucesso.',
                jogador
            });

        } catch (error) {
            next(error);
        }
    }

    async listar(req, res, next) {
        try {
            const jogadores = await jogadorService.listar();

            return res.status(200).json(jogadores);

        } catch (error) {
            next(error);
        }
    }

    async buscarPorId(req, res, next) {
        try {
            const jogador = await jogadorService.buscarPorId(req.params.id);

            return res.status(200).json(jogador);

        } catch (error) {
            next(error);
        }
    }

    async atualizar(req, res, next) {
        try {
            const jogador = await jogadorService.atualizar(
                req.params.id,
                req.body
            );

            return res.status(200).json({
                mensagem: 'Jogador atualizado com sucesso.',
                jogador
            });

        } catch (error) {
            next(error);
        }
    }

    async desativar(req, res, next) {
        try {
            const jogador = await jogadorService.desativar(req.params.id);

            return res.status(200).json({
                mensagem: 'Jogador desativado com sucesso.',
                jogador
            });

        } catch (error) {
            next(error);
        }
    }
}

module.exports = new JogadorController();
