
'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('treinos', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },

            codigo: {
                type: Sequelize.STRING(50),
                allowNull: false,
                unique: true
            },

            jogadorId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'jogadores',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT'
            },

            dataTreino: {
                type: Sequelize.DATE,
                allowNull: false
            },

            tipo: {
                type: Sequelize.ENUM('F', 'T', 'E'),
                allowNull: false
            },

            duracaoMin: {
                type: Sequelize.INTEGER,
                allowNull: false
            },

            intensidade: {
                type: Sequelize.INTEGER,
                allowNull: false
            },

            carga: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false
            },

            createdAt: {
                type: Sequelize.DATE,
                allowNull: false
            },

            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false
            }
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('treinos');
    }
};
