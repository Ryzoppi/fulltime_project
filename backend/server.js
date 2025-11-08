const express = require("express");
const mysql = require("mysql2");
const bcrypt = require('bcrypt')
const path = require("path");

const app = express();
const port = 3000;

app.use(express.json())

//Configuração do banco
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "projetofulltime"
});

//Testa a conexão
db.connect(err => {
  if (err) {
    console.error("Erro ao conectar no MySQL:", err);
    return;
  }
  console.log("Conectado ao MySQL!");
});

//Define pasta "public" para arquivos estáticos (HTML, CSS, JS, imagens, etc.)
app.use(express.static(path.join(__dirname, "../public")));

//Rota principal recebe login.html automaticamente
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/login.html"));
});

app.get('/usuarios', (req, res) => {
  db.query('SELECT * FROM Usuarios', (erro, resultados) => {
    if (erro) return res.status(500).json({ erro: erro.sqlMessage });
    res.json(resultados);
  });
});

app.post('/usuarios', async (req, res) => {
  const { nome, email, senha, empresa_id, perfil_id } = req.body

  if (!nome || !email || !senha || !empresa_id) {
    return res.status(400).json({ erro: 'Preencha todos os campos obrigatórios.' })
  }

  try {
    const senhaCriptografada = await bcrypt.hash(senha, 10)
    const sql = 'INSERT INTO Usuarios (nome, email, senha, empresa_id, perfil_id) VALUES (?, ?, ?, ?, ?)'
    const params = [nome, email, senhaCriptografada, empresa_id, perfil_id || null]

    db.query(sql, params, (erro, resultado) => {
      if (erro) return res.status(500).json({ erro: erro.sqlMessage })
      res.json({ mensagem: 'Usuário criado com sucesso!', id: resultado.insertId })
    })
  } catch (e) {
    res.status(500).json({ erro: 'Erro ao processar a senha.' })
  }
})

app.put('/usuarios/:id/perfil', (req, res) => {
  const { id } = req.params
  const { perfil_id } = req.body

  if (!perfil_id) {
    return res.status(400).json({ erro: 'Informe o perfil_id para atualizar.' })
  }

  const sql = 'UPDATE Usuarios SET perfil_id = ? WHERE id = ?'
  db.query(sql, [perfil_id, id], (erro) => {
    if (erro) return res.status(500).json({ erro: erro.sqlMessage })
    res.json({ mensagem: 'Perfil atualizado com sucesso!' })
  })
})

app.put('/perfis/:id/permissoes', (req, res) => {
  const { id } = req.params
  const { permissoes } = req.body

  if (!Array.isArray(permissoes)) {
    return res.status(400).json({ erro: 'Envie as permissões como uma lista de IDs.' })
  }

  const deletar = 'DELETE FROM Perfis_Permissoes WHERE perfil_id = ?'
  db.query(deletar, [id], (erro) => {
    if (erro) return res.status(500).json({ erro: erro.sqlMessage })

    if (permissoes.length === 0) {
      return res.json({ mensagem: 'Todas as permissões foram removidas.' })
    }

    const valores = permissoes.map(p => [id, p])
    const inserir = 'INSERT INTO Perfis_Permissoes (perfil_id, permissao_id) VALUES ?'

    db.query(inserir, [valores], (erro2) => {
      if (erro2) return res.status(500).json({ erro: erro2.sqlMessage })
      res.json({ mensagem: 'Permissões atualizadas com sucesso!' })
    })
  })
})

//Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
