import authenticate from "./authenticate.js"
import services from "../services/index.js";

document.addEventListener('DOMContentLoaded', async () => {
  authenticate.validateAuth()

  if (authenticate.isAdm()) {
    document.getElementById('linkGerenciamento').style.display = 'block'
  }

    const userId = localStorage.getItem("userId");
    if (!userId) return;

    // pega o usuário CRU do banco
    const user = await services.api.usuarios.get({ id: userId });


    if (!user) {
      console.error("Erro ao buscar usuário");
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
  }
});

document.getElementById('logout').addEventListener('click', () => authenticate.logout());