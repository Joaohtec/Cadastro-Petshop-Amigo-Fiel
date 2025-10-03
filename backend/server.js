/*
 * ===================================================================================
 * TÍTULO: Servidor Principal da Aplicação (server.js)
 * ===================================================================================
 */

// CORREÇÃO: Adicionamos esta linha no TOPO. Ela carrega as variáveis do arquivo .env.
require('dotenv').config();

// -----------------------------------------------------------------------------------
// SUBTÍTULO: Importações e Configuração Inicial
// -----------------------------------------------------------------------------------

// CORREÇÃO: Padronizamos todas as importações para usar 'require' (CommonJS).
const express = require('express');
const cors = require('cors');
// CORREÇÃO: Importamos o 'pool' que foi exportado pelo nosso arquivo db.js.
const pool = require('./db'); 

const app = express();
const port = 3000;

// -----------------------------------------------------------------------------------
// SUBTÍTULO: Configuração de Middlewares
// -----------------------------------------------------------------------------------
app.use(cors());

// CORREÇÃO: O middleware para ler JSON é uma função do próprio Express. O correto é 'express.json()'.
app.use(express.json());

// -----------------------------------------------------------------------------------
// SUBTÍTULO: Definição da Rota de Cadastro (API Endpoint)
// -----------------------------------------------------------------------------------
app.post("/cadastro", async (req, res) => {
  const {
    nome_completo, cpf, email, telefone, endereco,
    nome_pet, especie, raca, data_nascimento, observacoes,
  } = req.body;

  let connection;

  try {
    // CORREÇÃO: O método para pegar uma conexão vem do 'pool' que importamos.
    connection = await pool.getConnection();

    await connection.beginTransaction();

    const [donoResult] = await connection.query(
      "INSERT INTO donos (nome_completo, cpf, email, telefone, endereco) VALUES (?, ?, ?, ?, ?)",
      [nome_completo, cpf, email, telefone, endereco]
    );

    const id_dono = donoResult.insertId;

    await connection.query(
      "INSERT INTO pets (id_dono, nome_pet, especie, raca, data_nascimento, observacoes) VALUES (?, ?, ?, ?, ?, ?)",
      [id_dono, nome_pet, especie, raca, data_nascimento, observacoes || null]
    );

    await connection.commit();

    res.status(201).json({ message: "Cliente e pet cadastrados com sucesso!" });

  } catch (err) {
    if (connection) {
      await connection.rollback();
    }
    console.error("Erro na transação:", err.message);
    res.status(500).send("Erro no servidor ao cadastrar.");

  } finally {
    if (connection) {
      connection.release();
    }
  }
});

// -----------------------------------------------------------------------------------
// SUBTÍTULO: Inicialização do Servidor
// -----------------------------------------------------------------------------------
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});