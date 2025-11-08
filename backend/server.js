const express = require("express");
const path = require("path");

const app = express();
const port = 3000;

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

// Rotas importadas
const usuariosRoutes = require("./routes/usuarios");
const perfisRoutes = require("./routes/perfis");

app.use("/api/usuarios", usuariosRoutes);
app.use("/api/perfis", perfisRoutes);

// Rota principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/login.html"));
});

// Inicializa servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
