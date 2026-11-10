
function errorHandler(error, req, res, next) {
    console.error(error);

    let statusCode = error.statusCode || 500;
    let mensagem = error.message || 'Erro interno do servidor.';

    // Código duplicado
    if (error.name === 'SequelizeUniqueConstraintError') {
        statusCode = 409;
        mensagem = 'Já existe um registro com esse código.';
    }

    // Erro de validação do Sequelize
    else if (error.name === 'SequelizeValidationError') {
        statusCode = 400;
        mensagem = 'Os dados enviados são inválidos.';
    }

    // Violação de chave estrangeira
    else if (error.name === 'SequelizeForeignKeyConstraintError') {
        statusCode = 409;
        mensagem = 'A operação viola uma restrição de relacionamento do banco de dados.';
    }

    // JSON inválido no corpo da requisição
    else if (error.type === 'entity.parse.failed') {
        statusCode = 400;
        mensagem = 'O corpo da requisição contém um JSON inválido.';
    }

    // Não expor detalhes internos de erros inesperados
    if (statusCode >= 500) {
        mensagem = 'Erro interno do servidor.';
    }

    const resposta = { mensagem };

    // Informações adicionais para erros de validação
    if (
        error.name === 'SequelizeValidationError' &&
        error.errors
    ) {
        resposta.detalhes = error.errors.map(item => item.message);
    }

    return res.status(statusCode).json(resposta);
}

module.exports = errorHandler;
