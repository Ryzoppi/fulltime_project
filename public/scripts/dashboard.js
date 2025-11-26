import authenticate from "./authenticate.js";
import services from "../services/index.js";

document.addEventListener("DOMContentLoaded", async () => {
  authenticate.validateAuth();

  if (authenticate.isAdm()) {
    document.getElementById("linkGerenciamento").style.display = "block";
  }

  const userId = localStorage.getItem("userId");
  if (!userId) return;

  // ---- Pega o usuário real do banco
  const result = await services.api.usuarios.get({ id: userId });
  const user = result[0];
  const layout = Number(user?.layout ?? 3);

  aplicarLayoutGlobal(layout);

  document.getElementById("logout")
    .addEventListener("click", () => authenticate.logout());
});

/* =======================================================
   Função principal — aplica o layout em todas prioridades
   ======================================================= */
function aplicarLayoutGlobal(layout) {

  const container = document.querySelector("main.container");

  const cameras = [
    document.getElementById("camerasAlta"),
    document.getElementById("camerasMedia"),
    document.getElementById("camerasBaixa")
  ];

  const alarmes = [
    document.getElementById("alarmesAlta"),
    document.getElementById("alarmesMedia"),
    document.getElementById("alarmesBaixa")
  ];

  const secoes = [
    document.getElementById("grupoAlta").parentElement,  // section
    document.getElementById("grupoMedia").parentElement,
    document.getElementById("grupoBaixa").parentElement
  ];

  // --- Reset section contents ---
  secoes.forEach(sec => {
    const grupo = sec.querySelector(".grupo");
    grupo.innerHTML = "";
  });

  // ----------------------------
  // LAYOUT 1 → CÂMERAS EM CIMA
  // ----------------------------
  if (layout === 1) {
    secoes[0].querySelector(".grupo").appendChild(cameras[0]);
    secoes[1].querySelector(".grupo").appendChild(cameras[1]);
    secoes[2].querySelector(".grupo").appendChild(cameras[2]);

    secoes[0].querySelector(".grupo").appendChild(alarmes[0]);
    secoes[1].querySelector(".grupo").appendChild(alarmes[1]);
    secoes[2].querySelector(".grupo").appendChild(alarmes[2]);
    return;
  }

  // ----------------------------
  // LAYOUT 2 → ALARMES EM CIMA
  // ----------------------------
  if (layout === 2) {
    secoes[0].querySelector(".grupo").appendChild(alarmes[0]);
    secoes[1].querySelector(".grupo").appendChild(alarmes[1]);
    secoes[2].querySelector(".grupo").appendChild(alarmes[2]);

    secoes[0].querySelector(".grupo").appendChild(cameras[0]);
    secoes[1].querySelector(".grupo").appendChild(cameras[1]);
    secoes[2].querySelector(".grupo").appendChild(cameras[2]);
    return;
  }

  // ----------------------------
  // LAYOUT 3 → DEFAULT
  // ----------------------------
  secoes[0].querySelector(".grupo").appendChild(cameras[0]);
  secoes[0].querySelector(".grupo").appendChild(alarmes[0]);

  secoes[1].querySelector(".grupo").appendChild(cameras[1]);
  secoes[1].querySelector(".grupo").appendChild(alarmes[1]);

  secoes[2].querySelector(".grupo").appendChild(cameras[2]);
  secoes[2].querySelector(".grupo").appendChild(alarmes[2]);
}

// Configuração de prioridades de câmera e alarme
// 1 = topo, 2 = meio, 3 = baixo
const prioridadeConfig = {
  cameras: {
    alta: 1,
    media: 2,
    baixa: 3,
  },
  alarmes: {
    alta: 1,
    media: 2,
    baixa: 3,
  }
};

// Função para aplicar classes e ordem
function aplicarPrioridades() {
  const grupos = [
    { id: "Alta", prioCam: prioridadeConfig.cameras.alta, prioAlm: prioridadeConfig.alarmes.alta },
    { id: "Media", prioCam: prioridadeConfig.cameras.media, prioAlm: prioridadeConfig.alarmes.media },
    { id: "Baixa", prioCam: prioridadeConfig.cameras.baixa, prioAlm: prioridadeConfig.alarmes.baixa },
  ];

  grupos.forEach(grupo => {
    const cameras = document.getElementById(`cameras${grupo.id}`);
    const alarmes = document.getElementById(`alarmes${grupo.id}`);

    if (cameras) {
      cameras.classList.remove("prioridade-1", "prioridade-2", "prioridade-3");
      cameras.classList.add(`prioridade-${grupo.prioCam}`);
      cameras.style.order = grupo.prioCam;
    }
  });

  document.getElementById('logout')
    .addEventListener('click', () => authenticate.logout());
};
