**SmartStudy** é um protótipo de aplicação web voltada para estudos, com foco inicial nas telas de login e cadastro de usuário.
O sistema é dividido em duas partes:

1. Frontend (HTML/CSS/JS) – página moderna e minimalista hospedada no GitHub Pages.

2. Backend (Node.js + Express + SQLite) – servidor responsável por autenticação e armazenamento dos usuários, hospedado no Render.com ou executado localmente via GitHub Codespaces.

**Links Importantes:**
1. Página principal (GitHub Pages) - https://cristiano-srm.github.io/SmartStudy-GeQ-Software-Grupo-2/SmartStudy.html
2. Servidor Backend (Render) - https://smartstudy-backend-fqd0.onrender.com
3. Repositório GitHub - https://github.com/Cristiano-SRM/SmartStudy-GeQ-Software-Grupo-2

SmartStudy-GeQ-Software-Grupo-2/
├── server.js              # Servidor Node.js + Express + SQLite
├── database.db            # Banco de dados SQLite (armazenamento de usuários)
├── SmartStudy.html        # Página de login/cadastro (frontend)
├── package.json           # Configurações do Node.js
├── README.md              # Este arquivo :)
└── ...                    # Outros arquivos auxiliares (CSS, etc.)

 **Funcionamento do Sistema**
  **Backend** (Node + Express + SQLite)

O arquivo server.js cria um servidor Express que:

- Conecta a um banco SQLite local (database.db);

- Cria a tabela usuarios se não existir;

- Possui rotas:

 > POST /signup → Cadastra novos usuários;

 > POST /login → Verifica credenciais de login;

 > GET / → Rota de teste (“Servidor SmartStudy funcionando!”).

Ao ser iniciado, o servidor roda na porta 3000 dentro do Codespaces.

**Frontend** (HTML + CSS + JS)

A página SmartStudy.html contém dois formulários:

- Login (usuário + senha)

- Cadastro (usuário + senha + confirmar senha)

**As funções JavaScript realizam chamadas fetch() para o servidor backend:**
"
const API_URL = "https://smartstudy-backend-fqd0.onrender.com";

fetch(`${API_URL}/signup`, { ... });
fetch(`${API_URL}/login`, { ... }); 
"
Essas chamadas são enviadas via HTTPS para o servidor do Render.com, que responde com mensagens JSON.

**Rodando Localmente (GitHub Codespaces)**
Passo 1: Instalando dependencias
npm init -y
npm install express sqlite3 body-parser cors

Passo 2: Rodar o servidor local
node server.js

Você entrara num prompt de node e sera informado caso a porta 3000 esteja aberta e o server esteja online (a porta 3000 deve ser publica)

nota pessoal: No Render, o SQLite é funcional, mas temporário (perde dados a cada novo deploy).
 Para persistência real, recomenda-se migrar para PostgreSQL, também suportado gratuitamente pelo Render.

