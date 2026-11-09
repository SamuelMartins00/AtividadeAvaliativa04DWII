
require('dotenv').config();

const app = require('./app');
const sequelize = require('./config/database');

const PORT = process.env.PORT || 3000;

async function iniciarServidor() {
    try {
        // Testa a conexão com o MySQL
        await sequelize.authenticate();

        console.log('Conexão com MySQL estabelecida!');

        // Inicia o servidor HTTP
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });

    } catch (error) {
        console.error('Não foi possível iniciar a aplicação.');
        console.error(error.message);

        process.exit(1);
    }
}

iniciarServidor();
