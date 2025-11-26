import express from "express";

import db from "../db.js";

const router = express.Router();

// GET /api/perfis
router.get("/", (req, res) => {
  const sql = `
        SELECT
            p.id,
            p.nome,
            GROUP_CONCAT(pp.permissao_id) AS permissoesPerfil
        FROM Perfis p
        LEFT JOIN Perfis_Permissoes pp ON p.id = pp.perfil_id
        GROUP BY p.id, p.nome
        ORDER BY p.id;
    `;

  db.query(sql, (erro, resultados) => {
    if (erro) {
      console.error("Erro ao buscar perfis:", erro);
      return res.status(500).json({ erro: erro.sqlMessage });
    }

    res.json(resultados);
  });
});

// GET /api/perfis/:id
router.get("/:id", (req, res) => {
  const { id } = req.params;

  const sql = "SELECT * FROM Perfis WHERE id = ?";
  const params = [id];

  db.query(sql, params, (erro, resultados) => {
    if (erro) return res.status(500).json({ erro: erro.sqlMessage });

    res.json(resultados);
  });
});

// POST /api/perfis
router.post("/", async (req, res) => {
  const { nome, permissoesPerfil } = req.body;

  if (!nome) {
    return res.status(400).json({ erro: "Preencha o nome." });
  }

  const permissaoIds = permissoesPerfil
    ? permissoesPerfil
        .split(",")
        .map((id) => parseInt(id.trim()))
        .filter((id) => !isNaN(id))
    : [];

  db.beginTransaction(async (erro) => {
    if (erro)
      return res.status(500).json({ erro: "Erro ao iniciar transação." });

    try {
      const sqlPerfil = "INSERT INTO Perfis (nome) VALUES (?)";
      const resultadoPerfil = await new Promise((resolve, reject) => {
        db.query(sqlPerfil, [nome], (err, result) => {
          if (err) return reject(err);
          resolve(result);
        });
      });

      const novoPerfilId = resultadoPerfil.insertId;

      if (permissaoIds.length > 0) {
        const values = permissaoIds.map((id) => [novoPerfilId, id]);
        const sqlPermissoes =
          "INSERT INTO Perfis_Permissoes (perfil_id, permissao_id) VALUES ?";

        await new Promise((resolve, reject) => {
          db.query(sqlPermissoes, [values], (err, result) => {
            if (err) return reject(err);
            resolve(result);
          });
        });
      }

      db.commit((erroCommit) => {
        if (erroCommit) {
          db.rollback(() => {});
          return res.status(500).json({
            erro: erroCommit.sqlMessage || "Erro ao finalizar criação.",
          });
        }
        res.json({ mensagem: "Perfil criado com sucesso!", id: novoPerfilId });
      });
    } catch (erroQuery) {
      db.rollback(() => {});
      console.error("Erro na transação de criação de perfil:", erroQuery);
      return res
        .status(500)
        .json({ erro: erroQuery.sqlMessage || "Erro interno do servidor." });
    }
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

export default router;
