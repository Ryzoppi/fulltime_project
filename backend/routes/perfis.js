const express = require("express");
const db = require("../db");

const router = express.Router();

// PUT /api/usuarios/:id/perfil
router.put("/:id/perfil", (req, res) => {
  const { id } = req.params;
  const { perfil_id } = req.body;

  if (!perfil_id) {
    return res.status(400).json({ erro: "Informe o perfil_id para atualizar." });
  }

  const sql = "UPDATE Usuarios SET perfil_id = ? WHERE id = ?";
  db.query(sql, [perfil_id, id], (erro) => {
    if (erro) return res.status(500).json({ erro: erro.sqlMessage });
    res.json({ mensagem: "Perfil atualizado com sucesso!" });
  });
});

module.exports = router;
