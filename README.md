# Fast React Template

O **Fast React** é um template de projeto **One-Page Application (SPA)** com arquitetura cliente-servidor. Ele oferece um sistema de gerenciamento de usuários completo, incluindo login, registro e todas as operações **CRUD (Create, Read, Update, Delete)**, com as devidas autorizações, tudo conectado diretamente ao frontend.

A arquitetura do projeto foi pensada para **reutilização de código**, tornando a adição de novos modelos e funcionalidades bastante simples. O frontend utiliza componentes React reutilizáveis, e o backend é bem organizado em subpastas, garantindo modularidade.

### 🚀 Principais Tecnologias:

  * **Backend:** Desenvolvido com **FastAPI** (Python), oferece assincronia, migrações com Alembic, testes de unidade, SQLAlchemy e CORS.
  * **Frontend:** Construído com **React** e **Tailwind CSS**, a comunicação com o backend é realizada via **Fetch API**.

-----

## 💻 Demonstração

![Uso do projeto](https://raw.githubusercontent.com/allan-rcos/fast-react/9a9e767646af6dd7208cb4d08eac175525633443/docs/fast-react.gif)

-----

## ⚙️ Tecnologias Utilizadas

Este projeto faz uso das seguintes tecnologias:

![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![SQLite](https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white)

-----

## 🛠️ Instalação

Siga os passos abaixo para configurar e rodar o projeto em sua máquina.

### 1\. Obtenha o Código Fonte

Crie uma pasta e extraia o código fonte. Se estiver usando Git, você pode clonar o repositório:

```bash
gh repo clone allan-rcos/fast-react
```

### 2\. Configure o Ambiente Python (Backend)

Este projeto oferece a flexibilidade de usar **VEnv** ou **Poetry** para gerenciar as dependências do Python.

Primeiro, navegue até a pasta `server`:

```bash
cd server
```

#### 2.1.a Instalação com Poetry (Recomendado)

Se você não tem o Poetry instalado, execute:

```bash
pip install --user pipx
pipx ensurepath
pipx install poetry
```

Para uma experiência mais integrada, instale o `poetry-plugin-shell`, que permite ativar o ambiente virtual com `poetry shell`:

```bash
pipx inject poetry poetry-plugin-shell
```

Agora, inicie o projeto para que o Poetry crie o ambiente virtual e instale as dependências:

```bash
poetry init
```

#### 2.1.b Instalação com VirtualEnv (Alternativa)

Para uma configuração mais simples com `venv`, crie o ambiente virtual na raiz do projeto:

```bash
python -m venv server
```

Ative o ambiente virtual:

```bash
server\Scripts\activate # No Windows
source server/bin/activate # No Linux/macOS
```

Instale as dependências listadas no `requirements.txt`:

```bash
pip install -r requirements.txt
```

**OBS:** Algumas instalações podem exigir a reinicialização da máquina.

#### 2.2 Configure o Banco de Dados

O projeto utiliza **SQLite** com **Alembic** para gerenciar as migrações do banco de dados. Altere a variável de ambiente com a URL do seu banco de dados e, em seguida, execute:

```bash
alembic upgrade head
```

Este comando criará automaticamente as tabelas definidas nos módulos de `models` e inicializará o banco de dados.

#### 2.3 Gere a Secret Key

A comunicação no projeto utiliza **JSON Web Tokens (JWT)**, exigindo uma chave secreta. Para facilitar, utilize o script fornecido para gerar e configurar essa chave na variável de ambiente:

```bash
python ./commands/generate_secret.py
```

Você pode especificar o tamanho da string da chave com o parâmetro `-l` ou `--Length`:

```bash
python ./commands/generate_secret.py -l 256
```

### 3\. Configure o Ambiente Node (Frontend)

Primeiro, certifique-se de ter o [Node.js e o npm](https://nodejs.org/en/download) instalados em sua máquina.

Navegue até a pasta `client`:

```bash
cd ../client
```

#### 3.1 Instale os Módulos Node

Execute o seguinte comando para instalar as dependências do frontend:

```bash
npm install
```

-----

## ✨ Uso

Siga as instruções abaixo para iniciar o servidor backend e o servidor frontend.

### 1\. Iniciando o Servidor FastAPI (Backend)

O servidor FastAPI opera na porta `8000` por padrão, mas neste projeto está configurado para a porta `5000`. Se desejar usar a porta padrão do FastAPI, você precisará criar uma variável de ambiente com a porta da API no servidor Node ou modificar diretamente o arquivo `src/config/ENV.js`.

Navegue até a pasta `server`:

```bash
cd server
```

#### 1.a Iniciando o FastAPI com Poetry

  * **Com Poetry Shell (recomendado):**
    ```bash
    poetry shell
    task run --port 5000
    ```
  * **Sem Poetry Shell:**
    ```bash
    poetry run task run --port 5000
    ```

#### 1.b Iniciando o FastAPI com VirtualEnv

```bash
fastapi dev server/app.py --port 5000
```

### 2\. Iniciando o Servidor Node (Frontend)

Com o servidor backend em execução, inicie o servidor frontend:

```bash
npm start
```

### 3\. Navegando pelo Projeto

O projeto possui duas páginas principais:

  * **Login:** Usada para autenticação. Automaticamente faz logout se o usuário já estiver logado.
  * **Users:** Tela de gerenciamento de usuários, incluindo uma tabela dinâmica e modais para criar, editar e remover usuários.

O servidor vem com um usuário **`admin`** com a senha **`admin`**. Você pode usá-lo para criar novos usuários no primeiro login. Esta funcionalidade pode ser removida em futuras atualizações.

-----

## ✏️ Contribuir

Este é um **projeto de treinamento**, sinta-se à vontade para cloná-lo e adaptá-lo. Ele pode ser tranquilamente utilizado como um template para novos projetos.

-----

## 🔓 Licença
[![APACHE](https://img.shields.io/badge/Apache--2.0-green?style=for-the-badge)](#)
