const { Jogador } = require('../models');

class JogadorService {

    // Cadastrar jogador
    async criar(dados) {
        const { nome, posicao } = dados;

        if (!nome || !posicao) {
            const error = new Error('Nome e posição são obrigatórios.');
            error.statusCode = 400;
            throw error;
        }

        const jogador = await Jogador.create({
            nome,
            posicao
        });

        return jogador;
    }

    // Listar todos os jogadores
    async listar() {
        return await Jogador.findAll({
            order: [['id', 'ASC']]
        });
    }

    // Buscar jogador por ID
    async buscarPorId(id) {
        const jogador = await Jogador.findByPk(id);

        if (!jogador) {
            const error = new Error('Jogador não encontrado.');
            error.statusCode = 404;
            throw error;
        }

        return jogador;
    }

    // Atualizar jogador
    async atualizar(id, dados, parcial = true) {
        const jogador = await this.buscarPorId(id);

        const { nome, posicao } = dados;

        if (!parcial && (nome === undefined || posicao === undefined)) {
            const error = new Error('Para atualizar com PUT, informe nome e posicao.');
            error.statusCode = 400;
            throw error;
        }

        if (nome === undefined && posicao === undefined) {
            const error = new Error('Informe pelo menos um campo para atualizar.');
            error.statusCode = 400;
            throw error;
        }

        if (nome !== undefined && (
            typeof nome !== 'string' || nome.trim().length < 2 || nome.trim().length > 100
        )) {
            const error = new Error('O nome deve ter entre 2 e 100 caracteres.');
            error.statusCode = 400;
            throw error;
        }

        if (posicao !== undefined && !['G', 'Z', 'M', 'A'].includes(posicao)) {
            const error = new Error('Posição inválida. Use G, Z, M ou A.');
            error.statusCode = 400;
            throw error;
        }

        await jogador.update({
            ...(nome !== undefined && { nome: nome.trim() }),
            ...(posicao !== undefined && { posicao })
        });

        return jogador;
    }

    // Desativar jogador
    async desativar(id) {
        const jogador = await this.buscarPorId(id);

        if (!jogador.ativo) {
            const error = new Error('O jogador já está desativado.');
            error.statusCode = 400;
            throw error;
        }

        await jogador.update({
            ativo: false
        });

        return jogador;
    }
}

module.exports = new JogadorService();
