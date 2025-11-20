CREATE SCHEMA IF NOT EXISTS ProjetoFulltime DEFAULT CHARACTER SET utf8;
USE ProjetoFulltime;

CREATE TABLE Perfis (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);

CREATE TABLE Permissoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    prioridade INT NOT NULL
);

CREATE TABLE Perfis_Permissoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    perfil_id INT NOT NULL,
    permissao_id INT NOT NULL,
    FOREIGN KEY (perfil_id) REFERENCES Perfis(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (permissao_id) REFERENCES Permissoes(id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Empresas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    documento VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE Usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    empresa_id INT NOT NULL,
    perfil_id INT,
    FOREIGN KEY (empresa_id) REFERENCES Empresas(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (perfil_id) REFERENCES Perfis(id)
        ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE Dispositivos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    empresa_id INT NOT NULL,
    FOREIGN KEY (empresa_id) REFERENCES Empresas(id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Logs_de_Atividade (
    id INT AUTO_INCREMENT PRIMARY KEY,
    data DATETIME NOT NULL,
    tipo VARCHAR(100) NOT NULL,
    usuario_id INT NOT NULL,
    dispositivo_id INT NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (dispositivo_id) REFERENCES Dispositivos(id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- =====================================================================
-- Dados inseridos para ajudar no desenvolvimento
-- =====================================================================

INSERT INTO Perfis (nome) VALUES 
('Administrador'),
('Gestor'),
('Colaborador');

INSERT INTO Permissoes (nome, prioridade) VALUES
('Acessar Relatórios', 1),
('Gerenciar Usuários', 2),
('Configurar Sistema', 3),
('Cadastrar Dispositivos', 2);

INSERT INTO Perfis_Permissoes (perfil_id, permissao_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4),
(2, 1), (2, 4),
(3, 1);

INSERT INTO Empresas (nome, documento) VALUES
('Tech Solutions LTDA', '12345678000199'),
('InovaCorp SA', '98765432000155');

INSERT INTO Usuarios (nome, email, senha, empresa_id, perfil_id) VALUES
('João Silva', 'joao@tech.com', '$2b$10$NKLgkpH5y8erSWGqv2rPXOoKpRvvgmFCzrXPshwwCKZmobhWCFARK', 1, 1),
('Maria Souza', 'maria@tech.com', '$2b$10$NKLgkpH5y8erSWGqv2rPXOoKpRvvgmFCzrXPshwwCKZmobhWCFARK', 1, 2),
('Carlos Lima', 'carlos@inova.com', '$2b$10$NKLgkpH5y8erSWGqv2rPXOoKpRvvgmFCzrXPshwwCKZmobhWCFARK', 2, 3);

INSERT INTO Dispositivos (nome, tipo, empresa_id) VALUES
('Servidor Principal', 'Servidor', 1),
('Notebook Gestor', 'Laptop', 1),
('Tablet Colaborador', 'Tablet', 2);

INSERT INTO Logs_de_Atividade (data, tipo, usuario_id, dispositivo_id) VALUES
(NOW(), 'Login realizado', 1, 1),
(NOW(), 'Acesso ao sistema', 2, 2),
(NOW(), 'Consulta de relatórios', 3, 3),
(NOW(), 'Configuração alterada', 1, 1);