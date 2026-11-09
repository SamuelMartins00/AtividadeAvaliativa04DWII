
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Jogador = sequelize.define('Jogador', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    nome: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'O nome do jogador é obrigatório.'
            },
            len: {
                args: [2, 100],
                msg: 'O nome deve ter entre 2 e 100 caracteres.'
            }
        }
    },

    posicao: {
        type: DataTypes.ENUM('G', 'Z', 'M', 'A'),
        allowNull: false,
        validate: {
            isIn: {
                args: [['G', 'Z', 'M', 'A']],
                msg: 'Posição inválida.'
            }
        }
    },

    ativo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    tableName: 'jogadores',
    timestamps: true
});

module.exports = Jogador;
