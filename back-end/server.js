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
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'vitria_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'garfo',
  port: process.env.DB_PORT || 5432,
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

app.get("/api/postos_saude/:id", async (req, res) => {
  try {
    const result = await queryDB("SELECT * FROM postos_saude WHERE id_posto = $1 ORDER BY id_posto", [req.params.id]);
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

    // Validações
    if (!nome_posto || nome_posto.trim().length < 3) {
      return res.status(400).json({ error: "Nome do posto deve ter pelo menos 3 caracteres" });
    }
    if (!cnpj_posto || cnpj_posto.length !== 14) {
      return res.status(400).json({ error: "CNPJ deve ter 14 dígitos" });
    }
    if (!endereco_posto || endereco_posto.trim().length < 5) {
      return res.status(400).json({ error: "Endereço inválido" });
    }
    if (!email_posto || !email_posto.includes("@")) {
      return res.status(400).json({ error: "Email inválido" });
    }
    if (!senha_posto || senha_posto.length < 6) {
      return res.status(400).json({ error: "Senha deve ter pelo menos 6 caracteres" });
    }
    if (!responsavel_posto || responsavel_posto.trim().length < 3) {
      return res.status(400).json({ error: "Nome do responsável inválido" });
    }

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
    const { cnpj_posto, senha_posto } = req.body;

    const result = await queryDB(
      "SELECT * FROM postos_saude WHERE cnpj_posto = $1 AND ativo = TRUE",
      [cnpj_posto]
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
        cnpj_posto: posto.cnpj_posto,
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
// 🥼 ROTAS DE POSTOS DE SAÚDE
// ===========================

app.get("/api/postos_saude/cep/:cep", async (req, res) => {
  try {
    const { cep } = req.params;
    const result = await queryDB(
      `SELECT * FROM postos_saude WHERE ativo = TRUE AND cep_posto LIKE '${cep}%' ORDER BY nome_posto`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/postos_saude/:id", async (req, res) => {
  try {
    const result = await queryDB(
      "SELECT id_posto, nome_posto, cnpj_posto, endereco_posto, telefone_posto, email_posto, responsavel_posto FROM postos_saude WHERE id_posto = $1 AND ativo = TRUE",
      [req.params.id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Posto não encontrado" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===========================
// 💊 ROTAS DE MEDICAMENTOS
// ===========================

app.get("/api/medicamentos/cep/:cep", async (req, res) => {
  try {
    const { cep } = req.params;
    console.log(cep);
    const result = await queryDB(
      `SELECT m.*, ps.nome_posto, ps.endereco_posto AS localizacao, ps.telefone_posto
       FROM medicamentos m
       JOIN postos_saude ps ON m.id_posto = ps.id_posto
       WHERE ps.ativo = TRUE AND ps.cep_posto LIKE '${cep}%'
       ORDER BY m.nome_medicamento`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/medicamentos/:id", async (req, res) => {
  try {
    const result = await queryDB(
      `SELECT m.*, ps.nome_posto, ps.endereco_posto AS localizacao, ps.telefone_posto
       FROM medicamentos m
       JOIN postos_saude ps ON m.id_posto = ps.id_posto
       WHERE m.id_posto = $1
       ORDER BY m.nome_medicamento`, [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/medicamentos/:id", async (req, res) => {
  try {
    const result = await queryDB(
      `DELETE FROM medicamentos WHERE id_medicamento = $1 RETURNING *`,
      [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/medicamentos", async (req, res) => {
  try {
    const { nome_medicamento, data_validade, falta, quantidade, id_posto, miligramas, aceita_genericos } = req.body;

    // Buscar localização do posto dono
    // const postoResult = await queryDB(
    //   "SELECT endereco_posto FROM postos_saude WHERE id_posto = $1",
    //   [id_posto]
    // );
    // const localizacao = postoResult.rows[0]?.endereco_posto || null;
    // console.log(postoResult.rows)

    const result = await queryDB(
      "INSERT INTO medicamentos (nome_medicamento, data_validade, falta, quantidade, id_posto, miligramas, aceita_genericos) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *",
      [nome_medicamento, data_validade, falta, quantidade, id_posto, miligramas || null, aceita_genericos !== undefined ? aceita_genericos : true]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.log('Erro ao inserir medicamento:', err);
    res.status(500).json({ error: err.message });
  }
});

// Atualizar medicamento
app.put("/api/medicamentos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nome_medicamento, data_validade, falta, quantidade, miligramas, aceita_genericos, id_posto } = req.body;

    // Buscar localização do posto dono
    let localizacao = null;
    if (id_posto) {
      const postoResult = await queryDB(
        "SELECT endereco_posto FROM postos_saude WHERE id_posto = $1",
        [id_posto]
      );
      localizacao = postoResult.rows[0]?.endereco_posto || null;
    }

    const result = await queryDB(
      "UPDATE medicamentos SET nome_medicamento = $1, data_validade = $2, falta = $3, quantidade = $4, miligramas = $5, aceita_genericos = $6 WHERE id_medicamento = $7 RETURNING *",
      [nome_medicamento, data_validade, falta, quantidade, miligramas || null, aceita_genericos !== undefined ? aceita_genericos : true, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Medicamento não encontrado" });
    }

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