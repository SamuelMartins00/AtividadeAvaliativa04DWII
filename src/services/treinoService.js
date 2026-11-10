
const { Treino, Jogador } = require('../models');
const { isValidDateOnly } = require('../utils/date');

class TreinoService {

    // Calcula a carga do treino
    calcularCarga(duracaoMin, intensidade, tipo) {
        const multiplicadores = {
            F: 1.5,
            T: 1.2,
            E: 1.0
        };

        const multiplicador = multiplicadores[tipo];

        if (!multiplicador) {
            const error = new Error('Tipo de treino inválido.');
            error.statusCode = 400;
            throw error;
        }

        const carga = (duracaoMin / 10) * intensidade * multiplicador;

        return Number(carga.toFixed(2));
    }

    // Cadastrar treino
    async criar(dados) {
        const {
            codigo,
            jogadorId,
            dataTreino,
            tipo,
            duracaoMin,
            intensidade
        } = dados;

        // Validar campos obrigatórios
        if (
            !codigo ||
            !jogadorId ||
            !dataTreino ||
            !tipo ||
            duracaoMin === undefined ||
            intensidade === undefined
        ) {
            const error = new Error('Todos os campos do treino são obrigatórios.');
            error.statusCode = 400;
            throw error;
        }

        const codigoNormalizado = typeof codigo === 'string' ? codigo.trim() : '';
        if (!codigoNormalizado) {
            const error = new Error('O código do treino não pode ficar vazio.');
            error.statusCode = 400;
            throw error;
        }

        // Validar o identificador do jogador
        if (!Number.isInteger(Number(jogadorId)) || Number(jogadorId) <= 0) {
            const error = new Error('O jogadorId deve ser um número inteiro positivo.');
            error.statusCode = 400;
            throw error;
        }

        // Validar formato e existência da data civil
        if (!isValidDateOnly(dataTreino)) {
            const error = new Error('A data do treino deve existir e estar no formato AAAA-MM-DD.');
            error.statusCode = 400;
            throw error;
        }

        // Validar duração
        if (!Number.isInteger(Number(duracaoMin)) || Number(duracaoMin) <= 0) {
            const error = new Error('A duração deve ser um número inteiro positivo.');
            error.statusCode = 400;
            throw error;
        }

        // Validar intensidade
        if (
            !Number.isInteger(Number(intensidade)) ||
            Number(intensidade) < 1 ||
            Number(intensidade) > 10
        ) {
            const error = new Error('A intensidade deve estar entre 1 e 10.');
            error.statusCode = 400;
            throw error;
        }

        // Verificar se o jogador existe
        const jogador = await Jogador.findByPk(jogadorId);

        if (!jogador) {
            const error = new Error('Jogador não encontrado.');
            error.statusCode = 404;
            throw error;
        }

        // Impedir treinos para jogadores inativos
        if (!jogador.ativo) {
            const error = new Error('Não é permitido cadastrar treinos para jogadores inativos.');
            error.statusCode = 400;
            throw error;
        }

        // Calcular carga automaticamente
        const carga = this.calcularCarga(
            Number(duracaoMin),
            Number(intensidade),
            tipo
        );

        // Criar treino
        const treino = await Treino.create({
            codigo: codigoNormalizado,
            jogadorId,
            dataTreino,
            tipo,
            duracaoMin,
            intensidade,
            carga
        });

        return treino;
    }

    // Listar todos os treinos
    async listar(filtros = {}) {
        const { Op } = require('sequelize');
        const where = {};
        const { jogadorId, tipo, dataInicio, dataFim } = filtros;

        if (jogadorId !== undefined) {
            if (!/^\d+$/.test(String(jogadorId)) || Number(jogadorId) <= 0) {
                const error = new Error('jogadorId deve ser um inteiro positivo.');
                error.statusCode = 400;
                throw error;
            }
            where.jogadorId = Number(jogadorId);
        }

        if (tipo !== undefined) {
            if (!['F', 'T', 'E'].includes(tipo)) {
                const error = new Error('Tipo inválido. Use F, T ou E.');
                error.statusCode = 400;
                throw error;
            }
            where.tipo = tipo;
        }

        if ((dataInicio && !isValidDateOnly(dataInicio)) || (dataFim && !isValidDateOnly(dataFim))) {
            const error = new Error('As datas devem existir e seguir o formato AAAA-MM-DD.');
            error.statusCode = 400;
            throw error;
        }
        if (dataInicio && dataFim && dataInicio > dataFim) {
            const error = new Error('dataInicio não pode ser posterior a dataFim.');
            error.statusCode = 400;
            throw error;
        }
        if (dataInicio && dataFim) where.dataTreino = { [Op.between]: [dataInicio, dataFim] };
        else if (dataInicio) where.dataTreino = { [Op.gte]: dataInicio };
        else if (dataFim) where.dataTreino = { [Op.lte]: dataFim };

        return await Treino.findAll({
            where,
            include: [{ model: Jogador, as: 'jogador' }],
            order: [['dataTreino', 'DESC'], ['id', 'DESC']]
        });
    }

    // Listar treinos de um jogador
    async listarPorJogador(jogadorId) {
        const jogador = await Jogador.findByPk(jogadorId);

        if (!jogador) {
            const error = new Error('Jogador não encontrado.');
            error.statusCode = 404;
            throw error;
        }

        return await Treino.findAll({
            where: { jogadorId },
            order: [['dataTreino', 'DESC']]
        });
    }

    // Excluir treino pelo código
    async excluirPorCodigo(codigo) {
        const treino = await Treino.findOne({
            where: { codigo }
        });

        if (!treino) {
            const error = new Error('Treino não encontrado.');
            error.statusCode = 404;
            throw error;
        }

        await treino.destroy();

        return treino;
    }
}

module.exports = new TreinoService();
