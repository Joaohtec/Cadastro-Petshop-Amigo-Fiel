
-- CREATE DATABASE amigofiel_db;
-- use amigofiel_db;

CREATE TABLE donos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome_completo VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    endereco TEXT NOT NULL
);

-- Criação da tabela de Pets 
CREATE TABLE pets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_dono INT NOT NULL,
    nome_pet VARCHAR(255) NOT NULL,
    especie VARCHAR(100) NOT NULL,
    raca VARCHAR(100) NOT NULL,
    data_nascimento DATE NOT NULL,
    observacoes TEXT,
    FOREIGN KEY(id_dono) REFERENCES donos(id) ON DELETE CASCADE
);