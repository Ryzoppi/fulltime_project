import express from 'express'

import db from '../db.js'

const router = express.Router();

// GET /api/perfis
router.get("/", (req, res) => {
  const sql = "SELECT * FROM Perfis";

  db.query(sql, (erro, resultados) => {
    if (erro) return res.status(500).json({ erro: erro.sqlMessage });
    
    res.json(resultados);
  });
});

// GET /api/perfis/:id
router.get("/:id", (req, res) => {
  const { id } = req.params;

  const sql = "SELECT * FROM Perfis WHERE id = ?";
  const params = [id]

  db.query(sql, params, (erro, resultados) => {
    if (erro) return res.status(500).json({ erro: erro.sqlMessage });

    res.json(resultados);
  });
});

// POST /api/perfis
router.post("/", async (req, res) => {
  const { nome } = req.body;

  if (!nome) {
    return res.status(400).json({ erro: "Preencha o nome." });
  }

  const sql = "INSERT INTO Perfis (nome) VALUES (?)";
  const params = [nome];

  db.query(sql, params, (erro, resultado) => {
    if (erro) return res.status(500).json({ erro: erro.sqlMessage });

    res.json({ mensagem: "Perfil criado com sucesso!", id: resultado.insertId });
  });
});

// PUT /api/perfis/:id
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { nome } = req.body;

  const sql = "UPDATE Perfis SET nome = ? WHERE id = ?";
  db.query(sql, [nome, id], (erro) => {
    if (erro) return res.status(500).json({ erro: erro.sqlMessage });

    res.json({ mensagem: "Perfil atualizado com sucesso!" });
  });
});

// DELETE /api/perfis
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM Perfis WHERE id = ?";
  const params = [id];

  db.query(sql, params, (erro) => {
    if (erro) return res.status(500).json({ erro: erro.sqlMessage });

    res.json({ mensagem: "Perfil excluido com sucesso!" });
  });
});

export default router