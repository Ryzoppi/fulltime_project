import express from 'express'

import db from '../db.js'

const router = express.Router();

// GET /api/dispositivos
router.get("/", (req, res) => {
  const sql = "SELECT * FROM Dispositivos";

  db.query(sql, (erro, resultados) => {
    if (erro) return res.status(500).json({ erro: erro.sqlMessage });

    res.json(resultados);
  });
});

// GET /api/dispositivos/:id
router.get("/:id", (req, res) => {
  const { id } = req.params;

  const sql = "SELECT * FROM Dispositivos WHERE id = ?";
  const params = [id]

  db.query(sql, params, (erro, resultados) => {
    if (erro) return res.status(500).json({ erro: erro.sqlMessage });

    res.json(resultados);
  });
});

// POST /api/dispositivos
router.post("/", async (req, res) => {
  const { nome, tipo, empresa_id } = req.body;

  if (!nome || !tipo || !empresa_id) {
    return res.status(400).json({ erro: "Preencha todos os campos obrigatórios." });
  }

  const sql = "INSERT INTO Dispositivos (nome, tipo, empresa_id) VALUES (?, ?, ?)";
  const params = [nome, tipo, empresa_id];

  db.query(sql, params, (erro, resultado) => {
    if (erro) return res.status(500).json({ erro: erro.sqlMessage });

    res.json({ mensagem: "Dispositivo criado com sucesso!", id: resultado.insertId });
  });
});

// PUT /api/dispositivos/:id
router.put("/:id", async (req, res) => {
  const { id } = req.params
  const { nome, tipo } = req.body;

  const sql = "UPDATE Dispositivos SET nome = ?, tipo = ? WHERE id = ?";
  const params = [nome, tipo, id];

  db.query(sql, params, (erro) => {
    if (erro) return res.status(500).json({ erro: erro.sqlMessage });
    
    res.json({ mensagem: "Dispositivo atualizado com sucesso!" });
  });
});

// DELETE /api/dispositivos
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM Dispositivos WHERE id = ?";
  const params = [id];

  db.query(sql, params, (erro) => {
    if (erro) return res.status(500).json({ erro: erro.sqlMessage });
    
    res.json({ mensagem: "Dispositivo excluido com sucesso!" });
  });
});

export default router