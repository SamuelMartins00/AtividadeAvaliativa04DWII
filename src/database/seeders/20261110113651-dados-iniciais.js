
'use strict';

const multiplicadores = {
    F: 1.5,
    T: 1.2,
    E: 1.0
};

module.exports = {
    async up(queryInterface) {
        const agora = new Date();

        await queryInterface.bulkInsert('jogadores', [
            { id: 101, nome: 'Ana Silva', posicao: 'G', ativo: true, createdAt: agora, updatedAt: agora },
            { id: 102, nome: 'Bruno Costa', posicao: 'Z', ativo: true, createdAt: agora, updatedAt: agora },
            { id: 103, nome: 'Carla Souza', posicao: 'M', ativo: true, createdAt: agora, updatedAt: agora },
            { id: 104, nome: 'Diego Lima', posicao: 'A', ativo: true, createdAt: agora, updatedAt: agora },
            { id: 105, nome: 'Elisa Santos', posicao: 'Z', ativo: true, createdAt: agora, updatedAt: agora },
            { id: 106, nome: 'Fabio Alves', posicao: 'M', ativo: false, createdAt: agora, updatedAt: agora }
        ]);

        const dados = [
            ['001', 101, '2026-11-02', 'F', 60, 8],
            ['002', 101, '2026-11-04', 'T', 45, 7],
            ['003', 102, '2026-11-02', 'E', 90, 6],
            ['004', 102, '2026-11-05', 'F', 30, 8],
            ['005', 103, '2026-11-03', 'T', 60, 6],
            ['006', 103, '2026-11-06', 'E', 75, 8],
            ['007', 104, '2026-11-03', 'F', 50, 9],
            ['008', 104, '2026-11-07', 'T', 40, 5],
            ['009', 105, '2026-11-04', 'E', 60, 7],
            ['010', 105, '2026-11-08', 'F', 90, 8],
            ['011', 106, '2026-11-05', 'T', 45, 6],
            ['012', 101, '2026-11-08', 'E', 60, 5],

            ['013', 102, '2026-10-26', 'F', 30, 10],
            ['014', 103, '2026-10-27', 'T', 75, 7],
            ['015', 104, '2026-10-28', 'E', 60, 8],
            ['016', 105, '2026-10-29', 'F', 40, 8],
            ['017', 106, '2026-10-30', 'E', 30, 6],
            ['018', 101, '2026-10-26', 'T', 60, 7],
            ['019', 102, '2026-11-01', 'F', 45, 8],
            ['020', 103, '2026-11-01', 'E', 90, 5]
        ];

        const treinos = dados.map(([codigo, jogadorId, dataTreino, tipo, duracaoMin, intensidade]) => {
            const carga = (duracaoMin / 10) * intensidade * multiplicadores[tipo];

            return {
                codigo: `SEED-${codigo}`,
                jogadorId,
                dataTreino,
                tipo,
                duracaoMin,
                intensidade,
                carga: Number(carga.toFixed(2)),
                createdAt: agora,
                updatedAt: agora
            };
        });

        await queryInterface.bulkInsert('treinos', treinos);
    },

    async down(queryInterface) {
        const codigos = Array.from(
            { length: 20 },
            (_, i) => `SEED-${String(i + 1).padStart(3, '0')}`
        );

        await queryInterface.bulkDelete('treinos', {
            codigo: codigos
        });

        await queryInterface.bulkDelete('jogadores', {
            id: [101, 102, 103, 104, 105, 106]
        });
    }
};
