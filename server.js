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

// Tabela de sessões de estudo
db.run(`
  CREATE TABLE IF NOT EXISTS estudos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuarioId INTEGER NOT NULL,
    minutos INTEGER NOT NULL,
    data TEXT NOT NULL,
    FOREIGN KEY(usuarioId) REFERENCES usuarios(id)
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

      // Agora retornamos o ID e o nome do usuário
      res.json({
        message: 'Login realizado com sucesso!',
        usuarioId: row.id,
        usuario: row.usuario
      });
    }
  );
});

// Registrar sessão de estudo
app.post('/estudos', (req, res) => {
  console.log("📩 Requisição recebida em /estudos:", req.body);

  const { usuarioId, minutos, data } = req.body;

  if (!usuarioId || !minutos || !data) {
    return res.status(400).json({ message: "Dados incompletos." });
  }

  const sql = `
    INSERT INTO estudos (usuarioId, minutos, data)
    VALUES (?, ?, ?)
  `;

  db.run(sql, [usuarioId, minutos, data], function(err) {
    if (err) {
      console.error("Erro ao registrar estudo:", err.message);
      return res.status(500).json({ message: "Erro ao salvar sessão." });
    }

    res.json({
      message: "Sessão registrada com sucesso!",
      id: this.lastID
    });
  });
});

// Obter dados de estudo do usuário
app.get('/estudos/:usuarioId', (req, res) => {
    const usuarioId = req.params.usuarioId;

    db.all(
        `SELECT minutos, data FROM estudos WHERE usuarioId = ?`,
        [usuarioId],
        (err, rows) => {
            if (err) return res.status(500).json({ message: "Erro ao buscar estudos." });

            let totalMinutos = 0;
            let totalSessoes = rows.length;

            rows.forEach(r => {
                totalMinutos += r.minutos;
            });

            res.json({
                totalMinutos,
                totalSessoes,
                registros: rows
            });
        }
    );
});

// Calcular streak (sequência de dias ativos)
app.get("/streak/:usuarioId", (req, res) => {
    const usuarioId = req.params.usuarioId;

    db.all(
        `SELECT DISTINCT data FROM estudos WHERE usuarioId = ? ORDER BY data DESC`,
        [usuarioId],
        (err, rows) => {
            if (err) return res.status(500).json({ message: "Erro ao calcular streak." });

            if (!rows || rows.length === 0) {
                return res.json({ streak: 0 });
            }

            let streak = 1;
            let prev = new Date(rows[0].data);

            for (let i = 1; i < rows.length; i++) {
                const current = new Date(rows[i].data);

                const diffDays = Math.ceil((prev - current) / (1000 * 60 * 60 * 24));

                if (diffDays === 1) {
                    streak++;
                    prev = current;
                } else {
                    break;
                }
            }

            res.json({ streak });
        }
    );
});

// Tempo de estudo nos últimos 7 dias
app.get("/estudos/semana/:usuarioId", (req, res) => {
    const usuarioId = req.params.usuarioId;

    db.all(
        `SELECT data, minutos FROM estudos WHERE usuarioId = ?`,
        [usuarioId],
        (err, rows) => {
            if (err) return res.status(500).json({ message: "Erro ao carregar dados semanais." });

            const mapa = {};

            // Inicia últimos 7 dias com zero
            for (let i = 0; i < 7; i++) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                const key = d.toISOString().split("T")[0];
                mapa[key] = 0;
                barras.forEach((bar, i) => {
    const dia = labels[i];
    const valor = minutosPorDia[dia];
    const porcentagem = Math.round((valor / max) * 100);

    console.log(`Atualizando ${dia}: ${valor} min → ${porcentagem}%`);

    bar.style.height = porcentagem + "%";
});

            }

            // Soma minutos
            rows.forEach(r => {
                if (mapa[r.data] !== undefined) {
                    mapa[r.data] += r.minutos;
                }
            });

            res.json(mapa);
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
