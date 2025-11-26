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

    // o layout salvo no banco
    const layout = user.layout ?? 0;
    
    await carregarDashboard();

    // aplica o layout cru
    aplicarLayout(layout);

  /* -------------------------
     AQUI ESTÁ O CÓDIGO CORRETO
  ----------------------------*/
  function aplicarLayout(layout) {
    const alta = document.querySelector(".prioridadeAlta");
    const media = document.querySelector(".prioridadeMedia");
  
    moverInterno(alta, layout);
    moverInterno(media, layout);
  }
  
  function moverInterno(container, layout) {
    if (!container) return;
  
    const cameras = [...container.querySelectorAll("img")];
    const alarmes = container.querySelector(".alarmes");
  
    container.innerHTML = "";
  
    switch (layout) {
      case 1: // CÂMERAS PRIMEIRO
        cameras.forEach(cam => container.appendChild(cam));
        container.appendChild(alarmes);
        break;
    
      case 2: // ALARMES PRIMEIRO
        container.appendChild(alarmes);
        cameras.forEach(cam => container.appendChild(cam));
        break;
    
      default:
        // padrão
        container.appendChild(cameras[0]);
        container.appendChild(alarmes);
        cameras.slice(1).forEach(cam => container.appendChild(cam));
    }

    if (alarmes) {
      alarmes.classList.remove("prioridade-1", "prioridade-2", "prioridade-3");
      alarmes.classList.add(`prioridade-${grupo.prioAlm}`);
      alarmes.style.order = grupo.prioAlm;
    }
  });
}



