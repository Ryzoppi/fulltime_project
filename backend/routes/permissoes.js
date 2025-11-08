const express = require("express");
const db = require("../db");

const router = express.Router();

// PUT /perfis/:id/permissoes
router.put("/:id/permissoes", (req, res) => {
  const { id } = req.params;
  const { permissoes } = req.body;

  if (!Array.isArray(permissoes)) {
    return res.status(400).json({ erro: "Envie as permissões como uma lista de IDs." });
  }

  const deletar = "DELETE FROM Perfis_Permissoes WHERE perfil_id = ?";
  db.query(deletar, [id], (erro) => {
    if (erro) return res.status(500).json({ erro: erro.sqlMessage });

    if (permissoes.length === 0) {
      return res.json({ mensagem: "Todas as permissões foram removidas." });
    }

    const valores = permissoes.map(p => [id, p]);
    const inserir = "INSERT INTO Perfis_Permissoes (perfil_id, permissao_id) VALUES ?";

    db.query(inserir, [valores], (erro2) => {
      if (erro2) return res.status(500).json({ erro: erro2.sqlMessage });
      res.json({ mensagem: "Permissões atualizadas com sucesso!" });
    });
  });
});