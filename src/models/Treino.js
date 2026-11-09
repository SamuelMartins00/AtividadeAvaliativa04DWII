
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Treino = sequelize.define('Treino', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    codigo: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: {
                msg: 'O código do treino é obrigatório.'
            }
        }
    },

    jogadorId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    dataTreino: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },

    tipo: {
        type: DataTypes.ENUM('F', 'T', 'E'),
        allowNull: false,
        validate: {
            isIn: {
                args: [['F', 'T', 'E']],
                msg: 'Tipo de treino inválido.'
            }
        }
    },

    duracaoMin: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isInt: {
                msg: 'A duração deve ser um número inteiro.'
            },
            min: {
                args: [1],
                msg: 'A duração deve ser maior que zero.'
            }
        }
    },

    intensidade: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isInt: {
                msg: 'A intensidade deve ser um número inteiro.'
            },
            min: 1,
            max: 10
        }
    },

    carga: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0
        }
    }
}, {
    tableName: 'treinos',
    timestamps: true
});

module.exports = Treino;
