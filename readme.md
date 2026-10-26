# Sistema de Gestão de Doações - Projeto Integrador II

## 📌 Objetivos do Sistema

O sistema tem como objetivo principal gerenciar doações para campanhas beneficentes de uma Igreja Evangélica, solucionando dificuldades logísticas. A plataforma visa rastrear a origem e o destino de cada doação, evitando estoques cheios, itens ociosos e facilitando o entendimento sobre o que ainda é necessário arrecadar, aumentando a efetividade das campanhas e diminuindo a sobrecarga dos responsáveis (Diáconos).

## 🛠 Tecnologias Utilizadas

### Frontend
* **Framework:** Angular
* **Arquitetura Visual:** Atomic Design (reaproveitamento de Átomos e Moléculas)
* **Gerenciamento de Estado/Reatividade:** RxJS e Signals

### Backend
* **Framework:** .NET 8 (C#)
* **Arquitetura:** Clean Architecture (simplificada em Domain, Application, Infrastructure e API)
* **Banco de Dados:** PostgreSQL (via Docker)
* **Gerenciamento de Variáveis:** DotNetEnv (para espelhar o `.env` do Docker)

## ⚙️ Regras de Negócio (Core)

1. **Vínculo Obrigatório:** Todas as doações devem ser obrigatoriamente vinculadas a uma campanha específica no momento do registro.
2. **Logística de Recolhimento:** O recolhimento físico das doações fica estritamente condicionado aos horários previamente disponibilizados na plataforma (exigindo a presença de diáconos).
3. **Privacidade e Histórico:** O cadastro de doadores serve exclusivamente para registro histórico e rastreabilidade de origem.
4. **Destino Documentado:** Toda saída ou distribuição de produtos deve ter seu destino final devidamente documentado no sistema.

---

## 🚀 Configuração e Execução do Projeto

### Pré-requisitos
Certifique-se de ter as seguintes ferramentas instaladas na sua máquina:
* [Node.js](https://nodejs.org/) (v18+) e Angular CLI (`npm install -g @angular/cli`)
* [.NET SDK 8.0+](https://dotnet.microsoft.com/download)
* [Docker Desktop](https://www.docker.com/products/docker-desktop) (para rodar o banco de dados)
* [Visual Studio Code](https://code.visualstudio.com/) (recomendado)

### 🛠️ Configuração Inicial (Primeira Vez)

Siga os passos abaixo na primeira vez que clonar o repositório na sua máquina:

1. **Configurar as Variáveis de Ambiente (Banco de Dados):**
   * Navegue até a pasta `backend`.
   * Crie um arquivo chamado `.env` (não suba esse arquivo para o GitHub, ele já está no `.gitignore`).
   * Copie o conteúdo de `.env.example` e preencha com a sua senha. Deve ficar parecido com isso:
     ```env
     DB_USER=postgres
     DB_PASSWORD=sua_senha_secreta_aqui
     DB_NAME=DoacoesDb
     ```
   * *Nota: O .NET e o Docker irão ler esse mesmo arquivo.*

2. **Instalar Dependências do Frontend:**
   * Abra o terminal na raiz do projeto e execute:
     ```bash
     cd frontend
     npm install
     ```

3. **Restaurar Pacotes do Backend:**
   * Abra o terminal na raiz do projeto e execute:
     ```bash
     cd backend
     dotnet restore
     ```

### ⚡ Como Rodar o Projeto (Recomendado via VS Code)

Nós configuramos um arquivo `tasks.json` para automatizar a inicialização de todo o ecossistema. 

1. Abra a pasta raiz do projeto no **VS Code**.
2. Pressione o atalho **`Ctrl + Shift + B`** (ou `Cmd + Shift + B` no Mac).
3. O VS Code fará o seguinte automaticamente:
   * Subirá o container do PostgreSQL em background (na porta 5433).
   * Dividirá o terminal inferior ao meio.
   * Iniciará a API .NET de um lado.
   * Iniciará o Frontend Angular do outro.

O Frontend estará disponível em `http://localhost:4200`.

### 🖥️ Como Rodar Manualmente (Via Terminal)

Caso não esteja utilizando o VS Code, você precisará de 3 abas de terminal:

**1. Subir o Banco de Dados (Docker):**
```bash
cd backend
docker-compose up -d
```
*(O banco rodará na porta 5433 local para evitar conflitos com outras instalações do Postgres).*

**2. Rodar a API (.NET):**
```bash
cd backend
dotnet run --project Api/Api.csproj
```

**3. Rodar o Frontend (Angular):**
```bash
cd frontend
npm start
```

### 🔒 Dados de Login
**1. Adonis:**
```bash
email: adonis.silva@aluno.ufop.edu.br
senha: 123456
```

**2. Caique:**
```bash
email: caique.leite@aluno.ufop.edu.br
senha: 123456
```