import express from "express"
import path from "path"
import { fileURLToPath } from "url"

import { 
  dispositivos, 
  empresas, 
  logsDeAtividade, 
  perfis, 
  perfisPermissoes, 
  permissoes, 
  usuarios 
} from './routes/index.js'

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

// Rotas
app.use("/api/dispositivos", dispositivos);
app.use("/api/empresas", empresas);
app.use("/api/logs_de_atividade", logsDeAtividade);
app.use("/api/perfis_permissoes", perfisPermissoes);
app.use("/api/perfis", perfis);
app.use("/api/permissoes", permissoes);
app.use("/api/usuarios", usuarios);

// Rota principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/login.html"));
});

// Inicializa servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
