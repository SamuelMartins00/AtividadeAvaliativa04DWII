
const { Treino, Jogador } = require('../models');

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
            codigo,
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
    async listar() {
        return await Treino.findAll({
            include: [{
                model: Jogador,
                as: 'jogador'
            }],
            order: [['dataTreino', 'DESC']]
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
