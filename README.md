# Sistema de Treinos Esportivos com Carga e Risco de Lesão

API REST desenvolvida em Node.js, Express, Sequelize e MySQL para gerenciamento de jogadores, treinos esportivos e análise de carga semanal, incluindo identificação de risco de lesão.

## 1. Tecnologias utilizadas

- Node.js
- Express
- Sequelize
- MySQL
- MySQL2
- dotenv
- Nodemon
- Sequelize CLI

## 2. Requisitos

Antes de executar o projeto, é necessário ter instalado:

- Node.js
- npm
- MySQL Server

## 3. Instalação

Clone ou baixe o projeto e acesse sua pasta pelo terminal.

Instale as dependências:

```bash
npm install
```

## 4. Configuração do banco de dados

Crie o banco de dados MySQL:

```sql
CREATE DATABASE treinos_esportivos;
```

Na raiz do projeto, crie um arquivo `.env` com as configurações:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_NAME=treinos_esportivos
DB_USER=root
DB_PASSWORD=sua_senha
```

Substitua `sua_senha` pela senha do seu MySQL.

**Importante:** não compartilhe o arquivo `.env`, pois ele contém credenciais de acesso ao banco de dados.

## 5. Estrutura do projeto

```text
├── src
│   ├── config
│   │   ├── config.js
│   │   └── database.js
│   ├── controllers
│   │   ├── configuracaoController.js
│   │   ├── jogadorController.js
│   │   ├── relatorioController.js
│   │   └── treinoController.js
│   ├── database
│   │   ├── migrations
│   │   │   ├── 20261109174007-create-jogadores.js
│   │   │   ├── 20261109174020-create-treinos.js
│   │   │   └── 20261109174029-create-configuracoes.js
│   │   └── seeders
│   │       └── 20261110113651-dados-iniciais.js
│   ├── middlewares
│   │   └── errorHandler.js
│   ├── models
│   │   ├── Configuracao.js
│   │   ├── Jogador.js
│   │   ├── Treino.js
│   │   └── index.js
│   ├── routes
│   │   ├── configuracaoRoutes.js
│   │   ├── jogadorRoutes.js
│   │   ├── relatorioRoutes.js
│   │   └── treinoRoutes.js
│   ├── utils
│   │   └── date.js
│   ├── services
│   │   ├── configuracaoService.js
│   │   ├── jogadorService.js
│   │   ├── relatorioService.js
│   │   └── treinoService.js
│   ├── app.js
│   └── server.js
├── .gitignore
├── .sequelizerc
├── README.md
├── package-lock.json
└── package.json
```

## 6. Executando as migrations

Para criar as tabelas no banco de dados, execute:

```bash
npx sequelize-cli db:migrate
```

As migrations criam as tabelas de jogadores, treinos e configurações.

## 7. Inserindo dados iniciais

Para inserir os dados de demonstração:

```bash
npx sequelize-cli db:seed:all
```

Os seeders adicionam jogadores e treinos para facilitar os testes da aplicação.

Para desfazer a execução do último seeder:

```bash
npx sequelize-cli db:seed:undo
```

## 8. Executando a aplicação

Para iniciar o servidor em modo de desenvolvimento:

```bash
npm run dev
```

A API ficará disponível em:

```text
http://localhost:3000
```

A documentação interativa da API (Swagger) ficará disponível em:

```text
http://localhost:3000/api-docs
```

## 9. Endpoints da API

### Jogadores

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/jogadores` | Cadastrar jogador |
| GET | `/jogadores` | Listar jogadores |
| GET | `/jogadores/:id` | Buscar jogador por ID |
| PATCH | `/jogadores/:id` | Atualizar parcialmente os dados do jogador (nome e/ou posição) |
| PATCH | `/jogadores/:id/desativar` | Desativar jogador |

### Treinos

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/treinos` | Cadastrar treino |
| GET | `/treinos` | Listar treinos |
| GET | `/treinos/jogador/:id` | Listar treinos de um jogador |
| DELETE | `/treinos/:codigo` | Excluir treino pelo código |

### Configuração

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/configuracao` | Consultar configuração |
| PUT | `/configuracao` | Cadastrar nova configuração de carga máxima semanal com data de vigência |

### Relatórios

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/relatorios/semanal?data=AAAA-MM-DD` | Gerar relatório semanal |

A data informada no relatório identifica a semana correspondente, considerando o período de segunda-feira a domingo. A carga máxima aplicada é a que estava vigente na data informada na consulta do relatório.

## 10. Regras de negócio

### Jogadores

- As posições permitidas são G (Goleiro), Z (Zagueiro), M (Meio-campista) e A (Atacante).
- Um jogador pode ser desativado sem excluir seu histórico de treinos.
- Jogadores inativos não podem receber novos treinos.

### Treinos

- O código do treino deve ser único e é armazenado sem espaços no início ou no fim.
- A data do treino deve existir e seguir o formato `AAAA-MM-DD`.
- O `jogadorId` deve ser um número inteiro positivo.
- A duração deve ser um número inteiro positivo.
- A intensidade deve estar entre 1 e 10.
- Os tipos permitidos são F (Físico), T (Técnico) e E (Estratégico).
- Cada treino deve estar associado a um jogador existente e ativo.

### Cálculo da carga

A carga do treino é calculada pela fórmula:

**Carga = (Duração em minutos / 10) × Intensidade × Multiplicador**

| Tipo | Multiplicador |
|---|---:|
| Físico (F) | 1,5 |
| Técnico (T) | 1,2 |
| Estratégico (E) | 1,0 |

### Risco de lesão

O risco é identificado quando a soma das cargas dos treinos de um jogador durante a semana ultrapassa a carga máxima semanal configurada.

A comparação é estrita: uma carga igual ao limite não representa risco.

### Vigência da configuração semanal

- Cada atualização da carga máxima cria um novo registro, preservando o histórico.
- A configuração informada em `dataVigencia` passa a valer a partir dessa data.
- Para o relatório, é utilizada a configuração mais recente cuja vigência seja menor ou igual à data informada na consulta que identifica a semana.
- Quando `dataVigencia` é omitida, a data atual é utilizada. Um registro com `dataVigencia: null` pode ser mantido como configuração-base sem data de início.

## 11. Relatório semanal

O relatório apresenta:

- Período semanal analisado.
- Quantidade total de treinos.
- Carga total da semana.
- Quantidade de jogadores que realizaram treinos.
- Carga e quantidade de treinos por jogador.
- Ranking de maior e menor carga, incluindo empates.
- Jogadores com carga acima do limite semanal.
- Média de carga e quantidade de treinos por tipo.
- Estatísticas agrupadas por posição.

Jogadores sem treinos na semana não aparecem nos rankings. Quando não existem treinos no período, os totais são apresentados como zero e os rankings ficam vazios.

## 12. Tratamento de erros

A API utiliza um middleware centralizado para padronizar as respostas de erro.

Principais códigos HTTP utilizados:

| Código | Significado |
|---|---|
| 200 | Requisição realizada com sucesso |
| 201 | Registro criado |
| 400 | Dados inválidos |
| 404 | Registro não encontrado |
| 409 | Conflito ou violação de restrição |
| 500 | Erro interno do servidor |

## 13. Observações

- O histórico de treinos é preservado quando um jogador é desativado.
- A carga dos treinos é calculada pela aplicação, não devendo ser informada manualmente pelo cliente.
- As consultas dos relatórios consideram semanas completas, de segunda-feira a domingo.
