
const { Op, fn, col } = require('sequelize');
const { Treino, Jogador } = require('../models');
const configuracaoService = require('./configuracaoService');
const { isValidDateOnly } = require('../utils/date');

class RelatorioService {

    // Descobre a segunda e o domingo da semana informada
    obterPeriodoSemanal(data) {
        if (!isValidDateOnly(data)) {
            const error = new Error('Informe uma data válida no formato AAAA-MM-DD.');
            error.statusCode = 400;
            throw error;
        }

        const [ano, mes, dia] = data.split('-').map(Number);
        const dataInformada = new Date(Date.UTC(ano, mes - 1, dia));

        // getUTCDay(): domingo = 0, segunda = 1, ..., sábado = 6
        const diaDaSemana = dataInformada.getUTCDay();

        // Quantos dias precisamos voltar para chegar à segunda-feira?
        const diasAteSegunda = (diaDaSemana + 6) % 7;

        const segunda = new Date(dataInformada);
        segunda.setUTCDate(segunda.getUTCDate() - diasAteSegunda);

        const domingo = new Date(segunda);
        domingo.setUTCDate(domingo.getUTCDate() + 6);

        return {
            inicio: segunda.toISOString().slice(0, 10),
            fim: domingo.toISOString().slice(0, 10)
        };
    }

    // Gerar relatório semanal
    async gerar(data) {
        const { inicio, fim } = this.obterPeriodoSemanal(data);

        // A carga limite é definida pela configuração vigente na data informada
        // para localizar a semana do relatório.
        const configuracao = await configuracaoService.buscar(data);

        const limiteSemanal = Number(configuracao.cargaMaximaSemanal);

        // Filtro dos treinos entre segunda e domingo
        const where = {
            dataTreino: {
                [Op.between]: [inicio, fim]
            }
        };

        // Quantidade total de treinos da semana
        const totalTreinos = await Treino.count({ where });

        // Soma da carga de todos os treinos da semana
        const cargaTotal = Number(
            (await Treino.sum('carga', { where })) || 0
        );

        // Soma da carga e quantidade de treinos por jogador
        const agregadosPorJogador = await Treino.findAll({
            attributes: [
                'jogadorId',
                [fn('SUM', col('carga')), 'cargaTotal'],
                [fn('COUNT', col('id')), 'quantidadeTreinos']
            ],
            where,
            group: ['jogadorId'],
            raw: true
        });

        // Buscar os dados dos jogadores que tiveram treinos
        const idsJogadores = agregadosPorJogador.map(
            item => item.jogadorId
        );

        const jogadores = idsJogadores.length
            ? await Jogador.findAll({
                where: {
                    id: {
                        [Op.in]: idsJogadores
                    }
                },
                attributes: ['id', 'nome', 'posicao', 'ativo']
            })
            : [];

        const jogadoresPorId = new Map(
            jogadores.map(jogador => [jogador.id, jogador])
        );

        // Montar os resultados por jogador
        const desempenhoPorJogador = agregadosPorJogador.map(item => {
            const jogador = jogadoresPorId.get(item.jogadorId);

            return {
                jogadorId: item.jogadorId,
                nome: jogador.nome,
                posicao: jogador.posicao,
                ativo: jogador.ativo,
                quantidadeTreinos: Number(item.quantidadeTreinos),
                cargaTotal: Number(item.cargaTotal)
            };
        });

        // Ordenar do maior para o menor
        desempenhoPorJogador.sort(
            (a, b) => b.cargaTotal - a.cargaTotal
        );

        // Identificar maior e menor carga, incluindo empates
        const maiorCarga = desempenhoPorJogador.length
            ? desempenhoPorJogador[0].cargaTotal
            : null;

        const menorCarga = desempenhoPorJogador.length
            ? desempenhoPorJogador[desempenhoPorJogador.length - 1].cargaTotal
            : null;

        const jogadoresMaiorCarga = maiorCarga === null
            ? []
            : desempenhoPorJogador.filter(
                jogador => jogador.cargaTotal === maiorCarga
            );

        const jogadoresMenorCarga = menorCarga === null
            ? []
            : desempenhoPorJogador.filter(
                jogador => jogador.cargaTotal === menorCarga
            );

        // Jogadores em risco: carga estritamente maior que o limite
        const jogadoresEmRisco = desempenhoPorJogador.filter(
            jogador => jogador.cargaTotal > limiteSemanal
        );

        // Média e quantidade de treinos agrupadas por tipo
        const mediaPorTipo = await Treino.findAll({
            attributes: [
                'tipo',
                [fn('AVG', col('carga')), 'cargaMedia'],
                [fn('COUNT', col('id')), 'quantidadeTreinos']
            ],
            where,
            group: ['tipo'],
            raw: true
        });

        const estatisticasPorTipo = mediaPorTipo.map(item => ({
            tipo: item.tipo,
            cargaMedia: Number(Number(item.cargaMedia).toFixed(2)),
            quantidadeTreinos: Number(item.quantidadeTreinos)
        }));

        // Agregação por posição executada diretamente no MySQL com GROUP BY.
        const estatisticasPorPosicao = await Treino.findAll({
            attributes: [
                [col('jogador.posicao'), 'posicao'],
                [fn('COUNT', fn('DISTINCT', col('Treino.jogadorId'))), 'quantidadeJogadores'],
                [fn('COUNT', col('Treino.id')), 'quantidadeTreinos'],
                [fn('SUM', col('Treino.carga')), 'cargaTotal'],
                [fn('AVG', col('Treino.carga')), 'cargaMediaPorSessao']
            ],
            include: [{
                model: Jogador,
                as: 'jogador',
                attributes: [],
                required: true
            }],
            where,
            group: [col('jogador.posicao')],
            order: [[col('jogador.posicao'), 'ASC']],
            raw: true
        }).then(registros => registros.map(item => ({
            posicao: item.posicao,
            quantidadeJogadores: Number(item.quantidadeJogadores),
            quantidadeTreinos: Number(item.quantidadeTreinos),
            cargaTotal: Number(Number(item.cargaTotal).toFixed(2)),
            cargaMediaPorSessao: Number(Number(item.cargaMediaPorSessao).toFixed(2))
        })));

        return {
            periodo: {
                inicio,
                fim
            },

            configuracao: {
                cargaMaximaSemanal: limiteSemanal
            },

            resumo: {
                totalTreinos,
                cargaTotal: Number(cargaTotal.toFixed(2)),
                quantidadeJogadores: desempenhoPorJogador.length
            },

            desempenhoPorJogador,

            ranking: {
                maiorCarga: {
                    valor: maiorCarga,
                    jogadores: jogadoresMaiorCarga
                },
                menorCarga: {
                    valor: menorCarga,
                    jogadores: jogadoresMenorCarga
                }
            },

            jogadoresEmRisco,

            estatisticasPorTipo,

            estatisticasPorPosicao
        };
    }
}

module.exports = new RelatorioService();
