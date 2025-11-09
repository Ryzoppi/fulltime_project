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
const permissoesRoutes = require("./routes/permissoes");
const perfisPermissoesRoutes = require("./routes/perfisPermissoes");
const empresasRoutes = require("./routes/empresas");
const dispositivosRoutes = require("./routes/dispositivos");
const logsDeAtividadeRoutes = require("./routes/logsDeAtividade");

app.use("/api/usuarios", usuariosRoutes);
app.use("/api/perfis", perfisRoutes);
app.use("/api/permissoes", permissoesRoutes);
app.use("/api/perfis_permissoes", perfisPermissoesRoutes);
app.use("/api/empresas", empresasRoutes);
app.use("/api/dispositivos", dispositivosRoutes);
app.use("/api/logs_de_atividade", logsDeAtividadeRoutes);

// Rota principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/login.html"));
});

// Inicializa servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
