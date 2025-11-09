const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../db");

const router = express.Router();

// GET /api/usuarios
router.get("/", (req, res) => {
  const sql = "SELECT * FROM Usuarios";

  db.query(sql, (erro, resultados) => {
    if (erro) return res.status(500).json({ erro: erro.sqlMessage });
    res.json(resultados);
  });
});

// GET /api/usuarios/:id
router.get("/:id", (req, res) => {
  const { id } = req.params;

  const sql = "SELECT * FROM Usuarios WHERE id = ?";
  const params = [id]

  db.query(sql, params, (erro, resultados) => {
    if (erro) return res.status(500).json({ erro: erro.sqlMessage });
    res.json(resultados);
  });
});

// POST /api/usuarios
router.post("/", async (req, res) => {
  const { nome, email, senha, empresa_id, perfil_id } = req.body;

  if (!nome || !email || !senha || !empresa_id || !perfil_id) {
    return res.status(400).json({ erro: "Preencha todos os campos obrigatórios." });
  }

  try {
    const senhaCriptografada = await bcrypt.hash(senha, 10);
    const sql = "INSERT INTO Usuarios (nome, email, senha, empresa_id, perfil_id) VALUES (?, ?, ?, ?, ?)";
    const params = [nome, email, senhaCriptografada, empresa_id, perfil_id];

    db.query(sql, params, (erro, resultado) => {
      if (erro) return res.status(500).json({ erro: erro.sqlMessage });
      res.json({ mensagem: "Usuário criado com sucesso!", id: resultado.insertId });
    });
  } catch (e) {
    res.status(500).json({ erro: "Erro ao processar a senha." });
  }
});

// PUT /api/usuarios/:id
router.put("/:id", async (req, res) => {
  const { id } = req.params
  const { nome, empresa_id, perfil_id } = req.body;

  const sql = "UPDATE Usuarios SET nome = ?, empresa_id = ?, perfil_id = ? WHERE id = ?";
  const params = [nome, empresa_id, perfil_id || null, id];

  db.query(sql, params, (erro) => {
      if (erro) return res.status(500).json({ erro: erro.sqlMessage });
      res.json({ mensagem: "Usuário atualizado com sucesso!" });
  });
});

// DELETE /api/usuarios
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM Usuarios WHERE id = ?";
  const params = [id];

  db.query(sql, params, (erro) => {
      if (erro) return res.status(500).json({ erro: erro.sqlMessage });
      res.json({ mensagem: "Usuário excluido com sucesso!" });
  });
});

module.exports = router;
