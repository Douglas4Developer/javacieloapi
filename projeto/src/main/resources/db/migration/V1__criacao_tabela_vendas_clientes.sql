CREATE TABLE vendas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    descricao VARCHAR(255) NOT NULL,
    valor DECIMAL(10, 2) NOT NULL,
    numero_cartao VARCHAR(255),
    validade_cartao VARCHAR(7),
    codigo_seguranca VARCHAR(255),
    payment_id VARCHAR(36),
    status INT,  -- Status transacional
    data_venda TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE usuarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL, -- Nome do usuário
    email VARCHAR(255) NOT NULL UNIQUE, -- Email que será usado como identificador de login
    password VARCHAR(255) NOT NULL, -- Senha do usuário, que será armazenada criptografada
    role ENUM('USER', 'ADMIN') DEFAULT 'USER', -- Enumeração para definir o papel do usuário
    data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Data de registro do usuário
);


CREATE TABLE refresh_token (
    token_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    refresh_token VARCHAR(500) NOT NULL,  -- O token de atualização
    expiration_time TIMESTAMP NOT NULL,   -- Data e hora de expiração do token
    user_id BIGINT NOT NULL,              -- Referência ao ID do usuário
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE forgot_password (
    fpid BIGINT AUTO_INCREMENT PRIMARY KEY,
    otp INT NOT NULL,                -- Código OTP (One-Time Password)
    expiration_time TIMESTAMP NOT NULL,  -- Tempo de expiração do OTP
    user_id BIGINT NOT NULL,             -- Referência ao ID do usuário
    CONSTRAINT fk_forgot_password_user FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE
);


CREATE TABLE clientes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    telefone VARCHAR(20),
    data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Exemplo de inserção inicial de dados
INSERT INTO clientes (nome, email, telefone) VALUES
('João Silva', 'joao.silva@email.com', '123456789'),
('Maria Oliveira', 'maria.oliveira@email.com', '987654321');
