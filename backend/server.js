const express = require("express");
const mysql = require("mysql2");
const path = require("path");

const app = express();
const port = 3000;

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

//Rota principal recebe gerenciamento.html automaticamente
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/gerenciamento.html"));
});

//Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
