
const { Configuracao } = require('../models');

class ConfiguracaoService {

    // Consultar a configuração mais recente
    async buscar() {
        const configuracao = await Configuracao.findOne({
            order: [['id', 'DESC']]
        });

        if (!configuracao) {
            const error = new Error('Nenhuma configuração cadastrada.');
            error.statusCode = 404;
            throw error;
        }

        return configuracao;
    }

    // Criar ou atualizar a configuração
    async salvar(dados) {
        const { cargaMaximaSemanal, dataVigencia } = dados;

        if (
            cargaMaximaSemanal === undefined ||
            cargaMaximaSemanal === null ||
            cargaMaximaSemanal === ''
        ) {
            const error = new Error('A carga máxima semanal é obrigatória.');
            error.statusCode = 400;
            throw error;
        }

        const carga = Number(cargaMaximaSemanal);

        if (!Number.isFinite(carga) || carga <= 0) {
            const error = new Error('A carga máxima semanal deve ser um número maior que zero.');
            error.statusCode = 400;
            throw error;
        }

        const configuracaoAtual = await Configuracao.findOne({
            order: [['id', 'DESC']]
        });

        if (configuracaoAtual) {
            await configuracaoAtual.update({
                cargaMaximaSemanal: carga,
                ...(dataVigencia !== undefined && { dataVigencia })
            });

            return configuracaoAtual;
        }

        return await Configuracao.create({
            cargaMaximaSemanal: carga,
            dataVigencia: dataVigencia ?? null
        });
    }
}

module.exports = new ConfiguracaoService();
