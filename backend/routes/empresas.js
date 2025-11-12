import express from 'express'

import db from '../db.js'

const router = express.Router();

// GET /api/empresas
router.get("/", (req, res) => {
  const sql = "SELECT * FROM Empresas";

  db.query(sql, (erro, resultados) => {
    if (erro) return res.status(500).json({ erro: erro.sqlMessage });
    
    res.json(resultados);
  });
});

// GET /api/empresas/:id
router.get("/:id", (req, res) => {
  const { id } = req.params;

  const sql = "SELECT * FROM Empresas WHERE id = ?";
  const params = [id]

  db.query(sql, params, (erro, resultados) => {
    if (erro) return res.status(500).json({ erro: erro.sqlMessage });

    res.json(resultados);
  });
});

// POST /api/empresas
router.post("/", async (req, res) => {
  const { nome, documento } = req.body;

  if (!nome || !documento) {
    return res.status(400).json({ erro: "Preencha todos os campos obrigatórios." });
  }

  const sql = "INSERT INTO Empresas (nome, documento) VALUES (?, ?)";
  const params = [nome, documento];

  db.query(sql, params, (erro, resultado) => {
    if (erro) return res.status(500).json({ erro: erro.sqlMessage });

    res.json({ mensagem: "Empresa criada com sucesso!", id: resultado.insertId });
  });
});

// PUT /api/empresas/:id
router.put("/:id", async (req, res) => {
  const { id } = req.params
  const { nome } = req.body;

  const sql = "UPDATE Empresas SET nome = ? WHERE id = ?";
  const params = [nome, id];

  db.query(sql, params, (erro) => {
    if (erro) return res.status(500).json({ erro: erro.sqlMessage });
    
    res.json({ mensagem: "Empresa atualizada com sucesso!" });
  });
});

// DELETE /api/empresas
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM Empresas WHERE id = ?";
  const params = [id];

  db.query(sql, params, (erro) => {
    if (erro) return res.status(500).json({ erro: erro.sqlMessage });

    res.json({ mensagem: "Empresa excluida com sucesso!" });
  });
});

export default router