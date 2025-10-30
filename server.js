// =======================
// SmartStudy - Backend
// =======================

// Importar dependências
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

// Criar app Express
const app = express();
const PORT = 3000;

// Middleware
app.use(cors({
  origin: 'https://cristiano-srm.github.io',  // domínio do seu GitHub Pages
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(bodyParser.json());

// =======================
// Conexão com o banco SQLite
// =======================
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('❌ Erro ao conectar ao banco de dados:', err.message);
  } else {
    console.log('✅ Conectado ao banco SQLite.');
  }
});

// Criar tabela se não existir
db.run(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL
  )
`);

// =======================
// Rotas principais
// =======================

// Teste rápido (ver se o servidor responde)
app.get('/', (req, res) => {
  res.send('🚀 Servidor SmartStudy funcionando!');
});

// Rota de cadastro
app.post('/signup', (req, res) => {
  console.log('📩 Requisição recebida em /signup:', req.body);
  const { usuario, senha } = req.body;

  if (!usuario || !senha) {
    return res.status(400).json({ message: 'Usuário e senha são obrigatórios.' });
  }

  db.run(
    `INSERT INTO usuarios (usuario, senha) VALUES (?, ?)`,
    [usuario, senha],
    function (err) {
      if (err) {
        console.error('Erro ao cadastrar:', err.message);
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ message: 'Usuário já existe.' });
        }
        return res.status(500).json({ message: 'Erro ao cadastrar usuário.' });
      }
      res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
    }
  );
});

// Rota de login
app.post('/login', (req, res) => {
  console.log('📩 Requisição recebida em /login:', req.body);
  const { usuario, senha } = req.body;

  db.get(
    `SELECT * FROM usuarios WHERE usuario = ? AND senha = ?`,
    [usuario, senha],
    (err, row) => {
      if (err) {
        console.error('Erro ao verificar login:', err.message);
        return res.status(500).json({ message: 'Erro interno no servidor.' });
      }
      if (!row) {
        return res.status(401).json({ message: 'Usuário ou senha incorretos.' });
      }
      res.json({ message: 'Login realizado com sucesso!' });
    }
  );
});

// =======================
// Inicializar servidor
// =======================
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
  console.log(`🌐 Acesse via Codespaces: use a URL pública da porta 3000`);
});
