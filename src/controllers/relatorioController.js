
const relatorioService = require('../services/relatorioService');

class RelatorioController {

    async semanal(req, res, next) {
        try {
            const { data } = req.query;

            const relatorio = await relatorioService.gerar(data);

            return res.status(200).json(relatorio);

        } catch (error) {
            next(error);
        }
    }
}

module.exports = new RelatorioController();
