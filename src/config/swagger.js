
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',

        info: {
            title: 'Sistema de Treinos Esportivos',
            version: '1.0.0',
            description: 'API REST para gerenciamento de jogadores, treinos esportivos, cargas semanais e identificação de risco de lesão.'
        },

        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor local de desenvolvimento'
            }
        ]
    },

    apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
