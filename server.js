// =======================
// SmartStudy - Backend (Supabase PostgreSQL)
// =======================

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require("pg");

const app = express();
const PORT = 3000;

// CORS — libere seu GitHub Pages
app.use(cors({
  origin: 'https://cristiano-srm.github.io',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(bodyParser.json());

// =======================
// Conexão com PostgreSQL (Supabase)
// =======================
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    ssl: { rejectUnauthorized: false }
});

pool.connect()
    .then(() => console.log("✅ Conectado ao PostgreSQL (Supabase)."))
    .catch(err => console.error("❌ Erro:", err));


// =======================
// Rotas
// =======================

// Rota básica
app.get('/', (req, res) => {
  res.send('🚀 Servidor SmartStudy funcionando (Supabase)!');
});

// -----------------------------------------
// Cadastro
// -----------------------------------------
app.post('/signup', async (req, res) => {
  const { usuario, senha } = req.body;

  if (!usuario || !senha) {
    return res.status(400).json({ message: "Usuário e senha obrigatórios." });
  }

  try {
    await pool.query(
      "INSERT INTO usuarios (usuario, senha) VALUES ($1, $2)",
      [usuario, senha]
    );

    res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
  } catch (err) {
    if (err.message.includes("duplicate key")) {
      return res.status(400).json({ message: "Usuário já existe." });
    }
    console.error(err);
    res.status(500).json({ message: "Erro ao cadastrar." });
  }
});

// -----------------------------------------
// Login
// -----------------------------------------
app.post('/login', async (req, res) => {
  const { usuario, senha } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM usuarios WHERE usuario = $1 AND senha = $2",
      [usuario, senha]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Usuário ou senha incorretos." });
    }

    const user = result.rows[0];

    res.json({
      message: "Login realizado com sucesso!",
      usuarioId: user.id,
      usuario: user.usuario
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro interno." });
  }
});

// -----------------------------------------
// Registrar sessão de estudo
// -----------------------------------------
app.post('/estudos', async (req, res) => {
  const { usuarioId, minutos, data } = req.body;

  if (!usuarioId || !minutos || !data) {
    return res.status(400).json({ message: "Dados incompletos." });
  }

  try {
    const result = await pool.query(
      "INSERT INTO estudos (usuarioId, minutos, data) VALUES ($1, $2, $3) RETURNING id",
      [usuarioId, minutos, data]
    );

    res.json({
      message: "Sessão registrada com sucesso!",
      id: result.rows[0].id
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao registrar sessão." });
  }
});

// -----------------------------------------
// Buscar totais
// -----------------------------------------
app.get('/estudos/:usuarioId', async (req, res) => {
  const usuarioId = req.params.usuarioId;

  try {
    const result = await pool.query(
      "SELECT minutos, data FROM estudos WHERE usuarioId = $1",
      [usuarioId]
    );

    let totalMinutos = 0;
    result.rows.forEach(r => totalMinutos += r.minutos);

    res.json({
      totalMinutos,
      totalSessoes: result.rows.length,
      registros: result.rows
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao buscar estudos." });
  }
});

// -----------------------------------------
// Streak
// -----------------------------------------
app.get("/streak/:usuarioId", async (req, res) => {
  const usuarioId = req.params.usuarioId;

  try {
    const result = await pool.query(
      "SELECT DISTINCT data FROM estudos WHERE usuarioId = $1 ORDER BY data DESC",
      [usuarioId]
    );

    const rows = result.rows;
    if (!rows || rows.length === 0) return res.json({ streak: 0 });

    let streak = 1;
    let prev = new Date(rows[0].data);

    for (let i = 1; i < rows.length; i++) {
      const current = new Date(rows[i].data);
      const diff = Math.ceil((prev - current) / (1000 * 60 * 60 * 24));

      if (diff === 1) {
        streak++;
        prev = current;
      } else break;
    }

    res.json({ streak });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao calcular streak." });
  }
});

// -----------------------------------------
// Últimos 7 dias
// -----------------------------------------
app.get('/estudos/semana/:usuarioId', async (req, res) => {
  const usuarioId = req.params.usuarioId;

  try {
    const result = await pool.query(
      "SELECT data, minutos FROM estudos WHERE usuarioId = $1",
      [usuarioId]
    );

    const raw = result.rows;
    const mapa = {};

    // inicia com zeros
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      mapa[d.toISOString().split("T")[0]] = 0;
    }

    // soma minutos
    raw.forEach(r => {
    const dataFormatada = r.data.split("T")[0];   // <- NORMALIZA!
    if (mapa[dataFormatada] !== undefined) {
        mapa[dataFormatada] += r.minutos;
    }
});

    res.json(mapa);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao carregar semana." });
  }
});

// criar matéria
app.post('/materias', async (req, res) => {
  const { usuarioId, nome, cor } = req.body;

  if (!usuarioId || !nome || !cor) {
    return res.status(400).json({ message: "Dados incompletos." });
  }

  try {
    const result = await pool.query(
      `INSERT INTO materias (usuarioId, nome, cor)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [usuarioId, nome, cor]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao criar matéria:", err);
    res.status(500).json({ message: "Erro ao criar matéria." });
  }
});

//listar matérias do usuário

app.get('/materias/:usuarioId', async (req, res) => {
  const usuarioId = req.params.usuarioId;

  try {
    const result = await pool.query(
      `SELECT * FROM materias
       WHERE usuarioId = $1
       ORDER BY criado_em DESC`,
      [usuarioId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao buscar matérias:", err);
    res.status(500).json({ message: "Erro ao buscar matérias." });
  }
});

// atualizar matéria

app.put('/materias/:id', async (req, res) => {
  const id = req.params.id;
  const { nome, cor, conteudo, concluida } = req.body;

  try {
    const result = await pool.query(
      `UPDATE materias
       SET nome = COALESCE($1, nome),
           cor = COALESCE($2, cor),
           conteudo = COALESCE($3, conteudo),
           concluida = COALESCE($4, concluida),
           atualizado_em = NOW()
       WHERE id = $5
       RETURNING *`,
      [nome, cor, conteudo, concluida, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao atualizar matéria:", err);
    res.status(500).json({ message: "Erro ao atualizar matéria." });
  }
});

// excluir matéria

app.delete('/materias/:id', async (req, res) => {
  const id = req.params.id;

  try {
    await pool.query("DELETE FROM materias WHERE id = $1", [id]);
    res.json({ message: "Matéria excluída." });
  } catch (err) {
    console.error("Erro ao excluir matéria:", err);
    res.status(500).json({ message: "Erro ao excluir matéria." });
  }
});



// =======================
// Inicializar servidor
// =======================
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});

