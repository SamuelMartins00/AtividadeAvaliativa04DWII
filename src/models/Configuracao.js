
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Configuracao = sequelize.define('Configuracao', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    cargaMaximaSemanal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: {
                args: [0],
                msg: 'A carga máxima semanal não pode ser negativa.'
            }
        }
    },

    dataVigencia: {
        type: DataTypes.DATEONLY,
        allowNull: true
    }
}, {
    tableName: 'configuracoes',
    timestamps: true
});

module.exports = Configuracao;
