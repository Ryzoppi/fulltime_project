import express from 'express'

import db from '../db.js'

const router = express.Router();

// GET /api/permissoes
router.get("/", (req, res) => {
  const sql = `
    SELECT pe.id, pe.nome, pe.prioridade
    FROM Permissoes pe
    ORDER BY pe.id ASC;
  `;

  db.query(sql, (erro, resultados) => {
    if (erro) return res.status(500).json({ erro: erro.sqlMessage });
    res.json(resultados);
  });
});

// GET /api/permissoes/:id
router.get("/:id", (req, res) => {
  const { id } = req.params;

  const sql = "SELECT * FROM Permissoes WHERE id = ?";
  const params = [id]

  db.query(sql, params, (erro, resultados) => {
    if (erro) return res.status(500).json({ erro: erro.sqlMessage });
    res.json(resultados);
  });
});

// POST /api/permissoes
router.post("/", async (req, res) => {
  const { nome, prioridade } = req.body;

  if (!nome || !prioridade) {
    return res.status(400).json({ erro: "Preencha todos os campos obrigatórios." });
  }

  const sql = "INSERT INTO Permissoes (nome, prioridade) VALUES (?, ?)";
  const params = [nome, prioridade];

  db.query(sql, params, (erro, resultado) => {
    if (erro) return res.status(500).json({ erro: erro.sqlMessage });
    res.json({ mensagem: "Permissão criada com sucesso!", id: resultado.insertId });
  });
});

// PUT /api/permissoes/:id
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { nome, prioridade } = req.body;

  const sql = "UPDATE Permissoes SET nome = ?, prioridade = ? WHERE id = ?";
  const params = [nome, prioridade, id];

  db.query(sql, params, (erro) => {
      if (erro) return res.status(500).json({ erro: erro.sqlMessage });
      res.json({ mensagem: "Permissão atualizada com sucesso!" });
  });
});

// DELETE /api/permissoes
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM Permissoes WHERE id = ?";
  const params = [id];

  db.query(sql, params, (erro) => {
      if (erro) return res.status(500).json({ erro: erro.sqlMessage });
      res.json({ mensagem: "Permissão excluido com sucesso!" });
  });
});

export default router