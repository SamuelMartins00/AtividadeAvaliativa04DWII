const { Op } = require('sequelize');
const { Configuracao } = require('../models');
const { isValidDateOnly, todayDateOnly } = require('../utils/date');

class ConfiguracaoService {

    // Retorna a configuração vigente na data de referência.
    // Registros sem dataVigencia são tratados como configuração-base histórica.
    async buscar(dataReferencia = todayDateOnly()) {
        if (!isValidDateOnly(dataReferencia)) {
            const error = new Error('A data de referência deve estar no formato AAAA-MM-DD e existir.');
            error.statusCode = 400;
            throw error;
        }

        const configuracao = await Configuracao.findOne({
            where: {
                [Op.or]: [
                    { dataVigencia: null },
                    { dataVigencia: { [Op.lte]: dataReferencia } }
                ]
            },
            order: [['dataVigencia', 'DESC'], ['id', 'DESC']]
        });

        if (!configuracao) {
            const error = new Error('Nenhuma configuração vigente para a data informada.');
            error.statusCode = 404;
            throw error;
        }

        return configuracao;
    }

    // Cada gravação cria uma nova versão para preservar o histórico de vigência.
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

        const vigencia = dataVigencia === undefined ? todayDateOnly() : dataVigencia;
        if (vigencia !== null && !isValidDateOnly(vigencia)) {
            const error = new Error('A data de vigência deve existir e estar no formato AAAA-MM-DD.');
            error.statusCode = 400;
            throw error;
        }

        return await Configuracao.create({
            cargaMaximaSemanal: carga,
            dataVigencia: vigencia
        });
    }
}

module.exports = new ConfiguracaoService();
