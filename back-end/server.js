const express = require("express");
const cors = require("cors");
const pkg = require("pg");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const readline = require("readline");
const { execSync } = require("child_process");

dotenv.config();
const { Pool } = pkg;

const app = express();
app.use(express.json());
app.use(cors());

// Configuração inicial do banco (PostgreSQL)
const pool = new Pool({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Função auxiliar para conexões
async function queryDB(sql, params = []) {
  const client = await pool.connect();
  try {
    const result = await client.query(sql, params);
    return result;
  } finally {
    client.release();
  }
}

// ==========================
// 🔐 Funções de Autenticação
// ==========================

const SECRET_KEY = process.env.JWT_SECRET || "sua_chave_secreta_aqui";

// Gera token JWT
function generateToken(posto) {
  return jwt.sign(
    {
      posto_id: posto.id_posto,
      posto_email: posto.email_posto,
      posto_nome: posto.nome_posto,
    },
    SECRET_KEY,
    { expiresIn: "24h" }
  );
}

// Middleware para verificar token
function tokenRequired(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "Token não fornecido" });

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.currentPosto = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido" });
  }
}

// ===========================
// 🧩 ROTAS DE AUTENTICAÇÃO
// ===========================
// ===========================
// 🏥 ROTAS DE POSTOS DE SAÚDE
// ===========================

app.get("/api/postos_saude", async (req, res) => {
  try {
    const result = await queryDB("SELECT * FROM postos_saude ORDER BY id_posto");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/register", async (req, res) => {
  try {
    const {
      nome_posto,
      cnpj_posto,
      endereco_posto,
      telefone_posto,
      email_posto,
      senha_posto,
      responsavel_posto,
      tipo_usuario = "FARMACEUTICO",
    } = req.body;

    const check = await queryDB(
      "SELECT id_posto FROM postos_saude WHERE email_posto = $1 OR cnpj_posto = $2",
      [email_posto, cnpj_posto]
    );
    if (check.rowCount > 0)
      return res.status(400).json({ error: "Email ou CNPJ já cadastrado" });

    const hash = await bcrypt.hash(senha_posto, 10);

    const result = await queryDB(
      `INSERT INTO postos_saude 
        (nome_posto, cnpj_posto, endereco_posto, telefone_posto, email_posto, senha_posto, responsavel_posto, tipo_usuario)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING id_posto, nome_posto, email_posto, responsavel_posto, tipo_usuario`,
      [
        nome_posto,
        cnpj_posto,
        endereco_posto,
        telefone_posto,
        email_posto,
        hash,
        responsavel_posto,
        tipo_usuario,
      ]
    );

    const posto = result.rows[0];
    const token = generateToken(posto);

    res.status(201).json({
      message: "Posto cadastrado com sucesso",
      token,
      posto,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email_posto, senha_posto } = req.body;

    const result = await queryDB(
      "SELECT * FROM postos_saude WHERE email_posto = $1 AND ativo = TRUE",
      [email_posto]
    );
    const posto = result.rows[0];
    if (!posto) return res.status(401).json({ error: "Posto não encontrado" });

    const valid = await bcrypt.compare(senha_posto, posto.senha_posto);
    if (!valid) return res.status(401).json({ error: "Senha incorreta" });

    const token = generateToken(posto);
    res.json({
      message: "Login realizado com sucesso",
      token,
      posto: {
        id_posto: posto.id_posto,
        nome_posto: posto.nome_posto,
        email_posto: posto.email_posto,
        responsavel_posto: posto.responsavel_posto,
        tipo_usuario: posto.tipo_usuario,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/me", tokenRequired, async (req, res) => {
  try {
    const result = await queryDB(
      "SELECT * FROM postos_saude WHERE id_posto = $1",
      [req.currentPosto.posto_id]
    );
    if (result.rowCount === 0)
      return res.status(404).json({ error: "Posto não encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===========================
// 💊 ROTAS DE MEDICAMENTOS
// ===========================

app.get("/api/medicamentos", async (req, res) => {
  try {
    const result = await queryDB(
      `SELECT m.*, c.nome_categoria FROM medicamentos m
      JOIN categorias_medicamentos c ON m.id_categoria = c.id_categoria
      ORDER BY m.nome_medicamento`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/medicamentos", async (req, res) => {
  try {
    const { nome_medicamento, id_categoria, data_validade, falta, quantidade } = req.body;
    console.log(falta)
    const result = await queryDB(
      "INSERT INTO medicamentos (nome_medicamento, id_categoria, data_validade, falta, quantidade) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [nome_medicamento, id_categoria, data_validade, falta, quantidade]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/medicamentos/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const estoque = await queryDB(
      "SELECT 1 FROM estoque_postos WHERE id_medicamento = $1 LIMIT 1",
      [id]
    );
    const transacoes = await queryDB(
      "SELECT 1 FROM transacoes_postos WHERE id_medicamento = $1 LIMIT 1",
      [id]
    );

    if (estoque.length > 0 || transacoes.length > 0) {
      return res.status(400).json({
        error: "Não é possível deletar o medicamento: ele está vinculado a estoques ou transações.",
      });
    }

    await queryDB("DELETE FROM medicamentos WHERE id_medicamento = $1", [id]);
    res.json({ message: "Medicamento deletado com sucesso" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===========================
// 📦 ROTAS DE ESTOQUE
// ===========================

app.get("/api/estoque", async (req, res) => {
  try {
    const result = await queryDB(`
      SELECT e.*, p.nome_posto, m.nome_medicamento, c.nome_categoria
      FROM estoque_postos e
      JOIN postos_saude p ON e.id_posto = p.id_posto
      JOIN medicamentos m ON e.id_medicamento = m.id_medicamento
      JOIN categorias_medicamentos c ON m.id_categoria = c.id_categoria
      ORDER BY p.nome_posto, m.nome_medicamento
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/estoque", tokenRequired, async (req, res) => {
  try {
    const { id_medicamento, quantidade } = req.body;
    const posto_id = req.currentPosto.posto_id;
    const result = await queryDB(
      "INSERT INTO estoque_postos (id_posto, id_medicamento, quantidade) VALUES ($1,$2,$3) RETURNING *",
      [posto_id, id_medicamento, quantidade]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/estoque/:id_estoque", async (req, res) => {
  try {
    const { quantidade } = req.body;
    const id_estoque = req.params.id_estoque;
    const result = await queryDB(
      "UPDATE estoque_postos SET quantidade = $1 WHERE id_estoque = $2 RETURNING *",
      [quantidade, id_estoque]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===========================
// 🔁 ROTA DE TESTE
// ===========================

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from Node.js!" });
});

// ===========================
// 🚀 Inicialização do Servidor
// ===========================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
