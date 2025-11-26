import express from "express";
import bcrypt from "bcrypt";

import db from "../db.js";

const router = express.Router();

// GET /api/usuarios
router.get("/", (req, res) => {
  const sql = `
        SELECT u.id, u.nome, u.email,
          e.nome AS nomeEmpresa,
          p.nome AS nomePerfil
        FROM Usuarios u
        LEFT JOIN Empresas e ON u.empresa_id = e.id
        LEFT JOIN Perfis p ON u.perfil_id = p.id
        ORDER BY u.id;
    `;

  db.query(sql, (erro, resultados) => {
    if (erro) {
      console.error("Erro ao buscar usuários:", erro);
      return res.status(500).json({ erro: erro.sqlMessage });
    }
    res.json(resultados);
  });
});

// GET /api/usuarios/:id
router.get("/:id", (req, res) => {
  const { id } = req.params;

  const sql = "SELECT * FROM Usuarios WHERE id = ?";
  const params = [id];

  db.query(sql, params, (erro, resultados) => {
    if (erro) return res.status(500).json({ erro: erro.sqlMessage });
    res.json(resultados);
  });
});

// POST /api/usuarios/auth
router.post("/auth", (req, res) => {
  const { email, senha } = req.body;

  const sql = "SELECT * FROM Usuarios WHERE email = ?";
  const params = [email];

  db.query(sql, params, async (erro, resultados) => {
    if (erro) return res.status(500).json({ erro: erro.sqlMessage });

    if (resultados.length === 0) {
      return res
        .status(401)
        .json({ status: 401, mensagem: "Credenciais inválidas" });
    }

    const usuario = resultados[0];
    const match = await bcrypt.compare(senha, usuario.senha);

    if (match) {
      return res.status(200).json({
        status: 200,
        mensagem: "Login bem-sucedido",
        userId: usuario.id,
      });
    } else {
      return res
        .status(401)
        .json({ status: 401, mensagem: "Credenciais inválidas" });
    }
  });
});

// POST /api/usuarios
router.post("/", async (req, res) => {
  const { nome, email, senha, empresaId, perfilId } = req.body;

  if (!nome || !email || !senha || !empresaId || !perfilId) {
    return res.status(400).json({ erro: "Preencha todos os campos obrigatórios." });
  }

  try {
    const senhaCriptografada = await bcrypt.hash(senha, 10);
    const sql = "INSERT INTO Usuarios (nome, email, senha, empresa_id, perfil_id) VALUES (?, ?, ?, ?, ?)";
    const params = [nome, email, senhaCriptografada, empresaId, perfilId];

    db.query(sql, params, (erro, resultado) => {
      if (erro) return res.status(500).json({ erro: erro.sqlMessage });
      res.json({
        mensagem: "Usuário criado com sucesso!",
        id: resultado.insertId,
      });
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

// PATCH /api/usuarios/:id/layout
router.patch("/:id/layout", (req, res) => {
  const { id } = req.params;
  const { layout } = req.body;

  const sql = "UPDATE Usuarios SET layout = ? WHERE id = ?";
  const params = [layout, id];

  db.query(sql, params, (erro) => {
    if (erro) return res.status(500).json({ erro: erro.sqlMessage });
    res.json({ mensagem: "Layout atualizado com sucesso!" });
  });
});


// DELETE /api/usuarios/:id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM Usuarios WHERE id = ?";
  const params = [id];

  db.query(sql, params, (erro) => {
    if (erro) return res.status(500).json({ erro: erro.sqlMessage });
    res.json({ mensagem: "Usuário excluido com sucesso!" });
  });
});

export default router;
