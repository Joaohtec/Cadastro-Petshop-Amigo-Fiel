/*
 * ===================================================================================
 * TÍTULO: Módulo de Conexão com o Banco de Dados (db.js)
 * ===================================================================================
 *
 * FUNCIONALIDADE:
 * Este arquivo é responsável por criar um "pool de conexões" com o banco de dados MySQL.
 *
 * CONCEITO: Pool de Conexões (Connection Pool)
 * Em vez de abrir e fechar uma conexão com o banco de dados para cada requisição (o que é
 * um processo lento e custoso), um "pool" mantém um conjunto de conexões prontas e
 * abertas. Quando o servidor precisa falar com o banco, ele "pega emprestada" uma conexão
 * do pool, usa e depois a "devolve". Isso aumenta drasticamente a performance e a
 * escalabilidade da nossa aplicação.
 *
 * REFERÊNCIA:
 * - Biblioteca utilizada: 'mysql2/promise'
 * - Link: https://github.com/sidorares/node-mysql2#using-promise-wrapper
 */

// -----------------------------------------------------------------------------------
// SUBTÍTULO: Importação da Biblioteca
// -----------------------------------------------------------------------------------
// FUNCIONALIDADE:
// Importamos a biblioteca 'mysql2'. A adição de '/promise' nos permite usar a sintaxe
// moderna de "async/await", que torna o código mais limpo e legível, evitando o
// "callback hell".
const mysql = require("mysql2/promise");

// -----------------------------------------------------------------------------------
// SUBTÍTULO: Criação do Pool de Conexões
// -----------------------------------------------------------------------------------
// FUNCIONALIDADE:
// Aqui criamos o pool. O objeto de configuração informa ao 'mysql2' como se conectar
// ao seu servidor MySQL.
const pool = mysql.createPool({
  /*
   * CONCEITO: Variáveis de Ambiente
   * Em um projeto real, essas credenciais (host, user, password, database) não devem
   * ficar diretamente no código. Elas seriam armazenadas em variáveis de ambiente
   * (usando um arquivo .env, por exemplo) por segurança. Para nosso estudo, vamos
   * mantê-las aqui para simplificar.
   */

  // host: O endereço do seu servidor de banco de dados. 'localhost' significa que está na sua própria máquina.
  host: "localhost",

  // user: O nome de usuário para acessar o MySQL. Geralmente 'root' em instalações locais.
  // ATENÇÃO: Substitua 'seu_usuario_mysql' pelo seu usuário real!
  user: process.env.DB_USER,

  // password: A senha para o usuário acima.
  // ATENÇÃO: Substitua 'sua_senha_mysql' pela sua senha real!
  password: process.env.DB_PASSWORD,

  // database: O nome do banco de dados que criamos com o 'schema.sql'.
  database: process.env.DB_DATABASE,

  port: process.env.DB_PORT,

  // waitForConnections: Se todas as conexões do pool estiverem em uso, a aplicação irá esperar por uma ficar livre.
  waitForConnections: true,

  // connectionLimit: O número máximo de conexões que o pool irá manter abertas.
  connectionLimit: 10,

  // queueLimit: O número de requisições que podem ficar na fila esperando por uma conexão. 0 significa sem limite.
  queueLimit: 0,
});

// -----------------------------------------------------------------------------------
// SUBTÍTULO: Exportação do Módulo
// -----------------------------------------------------------------------------------
// FUNCIONALIDADE:
// 'module.exports' é o mecanismo padrão do Node.js para tornar variáveis ou funções
// de um arquivo disponíveis para outros arquivos. Ao exportar o 'pool', permitimos que
// o nosso 'server.js' o importe e o utilize para fazer queries no banco de dados.
module.exports = pool;
