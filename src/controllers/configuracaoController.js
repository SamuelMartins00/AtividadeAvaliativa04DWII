
const configuracaoService = require('../services/configuracaoService');

class ConfiguracaoController {

    async buscar(req, res, next) {
        try {
            const configuracao = await configuracaoService.buscar();

            return res.status(200).json(configuracao);

        } catch (error) {
            next(error);
        }
    }

    async salvar(req, res, next) {
        try {
            const configuracao = await configuracaoService.salvar(req.body);

            return res.status(200).json({
                mensagem: 'Configuração salva com sucesso.',
                configuracao
            });

        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ConfiguracaoController();
