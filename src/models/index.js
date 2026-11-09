
const Jogador = require('./Jogador');
const Treino = require('./Treino');
const Configuracao = require('./Configuracao');

// Um jogador pode possuir vários treinos.
Jogador.hasMany(Treino, {
    foreignKey: 'jogadorId',
    as: 'treinos',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});

// Cada treino pertence a um jogador.
Treino.belongsTo(Jogador, {
    foreignKey: 'jogadorId',
    as: 'jogador'
});

module.exports = {
    Jogador,
    Treino,
    Configuracao
};
