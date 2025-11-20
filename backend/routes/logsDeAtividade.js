import express from 'express'

import db from '../db.js'

const router = express.Router();

// GET /api/logs_de_atividade
router.get("/", (req, res) => {
  const sql = `
    SELECT l.id, l.data, l.tipo, u.nome AS nomeUsuario, d.nome AS nomeDispositivo
    FROM Logs_de_Atividade l
    LEFT JOIN Usuarios u ON l.usuario_id = u.id
    LEFT JOIN Dispositivos d ON l.dispositivo_id = d.id
    ORDER BY l.data DESC;
  `;

  db.query(sql, (erro, resultados) => {
    if (erro) {
      console.error("Erro na consulta SQL:", erro);
      return res.status(500).json({ erro: erro.sqlMessage });
    }
    
    res.json(resultados);
  });
});

// POST /api/logs_de_atividade
router.post("/", async (req, res) => {
  const { usuario_id, dispositivo_id, tipo } = req.body;    
  const data = new Date();

  if (!usuario_id || !dispositivo_id || !tipo) {
    return res.status(400).json({ erro: "Preencha todos os campos obrigatórios." });
  }

  const sql = "INSERT INTO Logs_de_Atividade (usuario_id, dispositivo_id, tipo, data) VALUES (?, ?, ?, ?)";
  const params = [usuario_id, dispositivo_id, tipo, data];

  db.query(sql, params, (erro, resultado) => {
    if (erro) return res.status(500).json({ erro: erro.sqlMessage });
    
    res.json({ mensagem: "Log criado com sucesso!", id: resultado.insertId });
  });
});

export default router