const express = require("express");
const mysql = require("mysql2");

const app = express();
const port = 3000;

// Configuração do banco
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "projetofulltime"
});

// Testa a conexão
db.connect(err => {
  if (err) {
    console.error("Erro ao conectar no MySQL:", err);
    return;
  }
  console.log("Conectado ao MySQL!");
});

// Rota de teste
app.get("/", (req, res) => {
  res.send("Servidor Node.js rodando 🚀");
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
