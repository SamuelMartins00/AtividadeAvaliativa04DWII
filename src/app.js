const express = require('express');

const app = express();

const jogadorRoutes = require('./routes/jogadorRoutes');
const treinoRoutes = require('./routes/treinoRoutes');
const configuracaoRoutes = require('./routes/configuracaoRoutes');
const relatorioRoutes = require('./routes/relatorioRoutes');
const errorHandler = require('./middlewares/errorHandler');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rota inicial
app.get('/', (req, res) => {
    return res.status(200).json({
        mensagem: 'API de Treinos Esportivos funcionando!'
    });
});

// Rotas de jogadores
app.use('/jogadores', jogadorRoutes);

app.use('/treinos', treinoRoutes);

app.use('/configuracao', configuracaoRoutes);

app.use('/relatorios', relatorioRoutes);

// Tratamento centralizado de erros
app.use((error, req, res, next) => {
    console.error(error);

    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
        mensagem: error.message || 'Erro interno do servidor.'
    });
});

app.use(errorHandler);

module.exports = app;