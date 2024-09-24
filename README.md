# ApiCielo - Integração com API de Pagamentos da Cielo

![image](https://github.com/user-attachments/assets/2b80261b-e407-468a-8adc-79bb312ce7ac)

 
Este repositório contém uma aplicação de integração com a API de pagamentos da Cielo. O projeto é estruturado em **backend** e **frontend**, utilizando **Spring Boot**, **Angular 18**, **MySQL** e **Docker**. A aplicação permite o processamento de vendas com cartões de crédito, exibição de status de transações e cancelamento de vendas.

## Sumário

- [Visão Geral](#visão-geral)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Como Rodar o Projeto Localmente](#como-rodar-o-projeto-localmente)
  - [Requisitos](#requisitos)
  - [Backend (Spring Boot)](#backend-spring-boot)
  - [Frontend (Angular)](#frontend-angular)
  - [Usando Docker](#usando-docker)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Configurações](#configurações)
  - [Banco de Dados](#banco-de-dados)
  - [Migrações com Flyway](#migrações-com-flyway)
  - [API da Cielo](#api-da-cielo)
- [Contribuição](#contribuição)
- [Licença](#licença)

## Visão Geral

O **ApiCielo** é um sistema para gerenciar vendas via cartão de crédito, incluindo funcionalidades de listagem, cancelamento e processamento de vendas. Ele utiliza a API de sandbox da **Cielo**, permitindo a simulação de transações reais. O projeto oferece uma API RESTful para operações no backend e um frontend responsivo em Angular para visualização e interação com as vendas.

![image](https://github.com/user-attachments/assets/f4a72c25-9b2e-4df1-848f-66816b161a93)
![image](https://github.com/user-attachments/assets/e03b3df0-8658-4192-b36b-6f2e1724b998)
![image](https://github.com/user-attachments/assets/48143275-d55f-40ae-81ac-0146b0f72166)

## Tecnologias Utilizadas

- **Backend**:
  - Java 21
  - Spring Boot
  - Spring Data JPA
  - Spring Security
  - Flyway para controle de migrações
  - JWT para autenticação
  - MySQL 8.0

- **Frontend**:
  - Angular 18
  - Angular Material
  - Flex Layout

- **Infraestrutura**:
  - Docker e Docker Compose

## Como Rodar o Projeto Localmente

### Requisitos

- **Java 21** ou superior
- **Node.js** (v18 ou superior)
- **MySQL 8.0**
- **Docker e Docker Compose**

### Backend (Spring Boot)

1. **Clone o Repositório**:

   ```bash
   git clone https://github.com/seu-usuario/projeto-apicielo.git
   cd projeto-apicielo/backend
   ```

2. **Configurar o Banco de Dados**:

   Certifique-se que o MySQL esteja rodando na porta padrão (3306) com o banco de dados `apicielo` criado. Ajuste as credenciais no arquivo `application.yml` se necessário.

3. **Rodar Migrações com Flyway**:

   Flyway gerenciará as migrações do banco de dados, criando as tabelas necessárias na inicialização da aplicação.

4. **Compilar e Executar a Aplicação**:

   ```bash
   ./mvnw clean install
   ./mvnw spring-boot:run
   ```

5. **Acessar o Backend**:

   O backend estará disponível em `http://localhost:8080`.

### Frontend (Angular)

1. **Navegar até o diretório do frontend**:

   ```bash
   cd ../frontend
   ```

2. **Instalar Dependências**:

   ```bash
   npm install
   ```

3. **Executar o servidor de desenvolvimento**:

   ```bash
   ng serve
   ```

4. **Acessar o Frontend**:

   Acesse `http://localhost:4200` no navegador.

### Usando Docker

Para facilitar o processo de configuração e execução, o projeto contém um arquivo `docker-compose.yml` para levantar o backend, banco de dados MySQL e persistir os dados via volumes Docker.

1. **Iniciar os containers Docker**:

   ```bash
   docker-compose up --build
   ```

2. **Acessar o Backend e Frontend**:

   - Backend: `http://localhost:8080`
   - Frontend: `http://localhost:4200`

### Estrutura do Projeto

```bash
projeto-apicielo/
│
├── backend/               # Código-fonte do backend (Spring Boot)
│   ├── src/               # Pacotes de controle, entidades, serviços e repositórios
│   ├── target/            # JAR gerado após build
│   └── Dockerfile         # Dockerfile para containerizar o backend
│
├── frontend/              # Código-fonte do frontend (Angular)
│   ├── src/               # Componentes, rotas e serviços Angular
│   └── Dockerfile         # Dockerfile para containerizar o frontend (opcional)
│
├── docker-compose.yml     # Arquivo Docker Compose para orquestrar os containers
├── README.md              # Este arquivo
└── .env                   # Arquivo de variáveis de ambiente (opcional)
```

## Configurações

### Banco de Dados

A aplicação utiliza **MySQL**. As credenciais de conexão e configuração do banco de dados estão no arquivo `application.yml` do backend:

Foi criado o banco apicielo para este projeto, porém crie conforme sua criatividade e lembre-se de colocar as suas credenciais.

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/apicielo
    username: root
    password: 326598
    driver-class-name: com.mysql.cj.jdbc.Driver
  jpa:
    hibernate:
      ddl-auto: none
    show-sql: true
```

### Migrações com Flyway

Flyway gerencia as migrações de banco de dados. As migrações estão na pasta `src/main/resources/db/migration`.

### API da Cielo

O projeto integra com a **API de Sandbox da Cielo**. As credenciais da Cielo estão configuradas no arquivo `application.yml`:

```yaml
cielo:
  merchant:
    id: SUA ID.......
    key: SUA KEY......
```

## Contribuição

Se deseja contribuir para este projeto, sinta-se à vontade para abrir uma **Issue** ou enviar um **Pull Request**.

1. **Fork o Repositório**
2. **Crie uma nova branch** (`git checkout -b feature/nova-funcionalidade`)
3. **Commit suas alterações** (`git commit -m 'Adiciona nova funcionalidade'`)
4. **Envie sua branch** (`git push origin feature/nova-funcionalidade`)
5. **Abra um Pull Request**

## Licença

Este projeto é licenciado sob a Licença MIT.
