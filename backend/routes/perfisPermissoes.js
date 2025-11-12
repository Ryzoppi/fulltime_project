import express from 'express'

import db from '../db.js'

const router = express.Router();

// POST /api/perfis_permissoes
router.post("/", async (req, res) => {
  const { permissao_id, perfil_id } = req.body;

  if (!permissao_id || !perfil_id) {
    return res.status(400).json({ erro: "Preencha todos os campos obrigatórios." });
  }

  const sql = "INSERT INTO Perfis_Permissoes (permissao_id, perfil_id) VALUES (?, ?)";
  const params = [permissao_id, perfil_id];

  db.query(sql, params, (erro, resultado) => {
    if (erro) return res.status(500).json({ erro: erro.sqlMessage });
    
    res.json({ mensagem: "Perfil vinculado a permissão com sucesso!", id: resultado.insertId });
  });
});

// DELETE /api/perfis_permissoes
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM Perfis_Permissoes WHERE id = ?";
  const params = [id];

  db.query(sql, params, (erro) => {
    if (erro) return res.status(500).json({ erro: erro.sqlMessage });
    
    res.json({ mensagem: "Vínculo de perfil e permissão excluido com sucesso!" });
  });
});

export default router