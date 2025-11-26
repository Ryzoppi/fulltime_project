import authenticate from "./authenticate.js";
import services from '../services/index.js';

console.log("userId no localStorage =", localStorage.getItem("userId"));

document.addEventListener('DOMContentLoaded', () => {
  authenticate.validateAuth();

  if (authenticate.isAdm()) {
    document.getElementById('linkGerenciamento').style.display = 'block';
  }

  const presets = {
    1: {
      title: "Prioridade Câmera",
      desc: "Foca nas câmeras, deixando os alarmes por último.",
      image: "assets/img-exemplo.jpg"
    },
    2: {
      title: "Prioridade Alarme",
      desc: "Foca nos alarmes, deixando as câmeras por último.",
      image: "assets/img-exemplo.jpg"
    },
    3: {
      title: "Default Layout",
      desc: "Layout padrão com câmeras e alarmes organizados igualmente.",
      image: "https://i.imgur.com/3a1ac8.png"
    }
  };

  const activeImage = document.querySelector(".preset-preview img");
  const activeTitle = document.querySelector(".preset-details h3");
  const activeDesc = document.querySelector(".preset-details p");
  const cards = [...document.querySelectorAll(".preset-card")];

  const userId = localStorage.getItem("userId");

  // Função que seta a UI para um presetId (1|2|3)
  function setPresetUI(presetId) {
    const id = Number(presetId) || 3;
    const p = presets[id] || presets[3];

    activeImage.src = p.image;
    activeTitle.textContent = p.title;
    activeDesc.textContent = p.desc;

    // marca visualmente o card selecionado
    cards.forEach(c => c.classList.toggle('selected', Number(c.dataset.preset) === id));
  }

  // Clicar no card: atualiza UI e salva no backend
  cards.forEach(card => {
    card.addEventListener('click', async () => {
      const presetId = Number(card.dataset.preset);
      console.log("Clicou preset", presetId, "userId", userId);

      // visual imediato
      setPresetUI(presetId);

      try {
        // salva no backend (inclua token se necessário no users.update)
        const updateResult = await services.api.usuarios.update({
          id: userId,
          layout: presetId
        });

        console.log("Resultado do update:", updateResult);

        // re-fetch para confirmar persistência (opcional, útil para debug)
        const fresh = await services.api.usuarios.get({ id: userId });
        console.log("Após update, GET retorna:", fresh);

        if (String(fresh.layout) !== String(presetId)) {
          console.warn("ATENÇÃO: backend não persistiu layout (ou retornou valor diferente).");
        } else {
          console.log("Persistência confirmada.");
        }
      } catch (err) {
        console.error("Erro ao atualizar layout:", err);
      }
    });
  });

  // Função que lê do backend e atualiza a UI
  async function carregarPresetSalvo() {
    if (!userId) {
      console.warn("userId não encontrado no localStorage");
      setPresetUI(3);
      return;
    }

    try {
      const userArray = await services.api.usuarios.get({ id: userId });
      const user = userArray[0];
      console.log(user.layout);

      if (!user) {
        console.error("Erro: usuário não retornado pelo backend");
        setPresetUI(3);
        return;
      }

      // usa o layout que veio do DB (fallback 3)
      const presetId = Number(user?.layout ?? 3);
      console.log("carregarPresetSalvo -> layout do servidor:", user.layout);
      setPresetUI(presetId);
    } catch (err) {
      console.error("Erro ao carregar preset salvo:", err);
      setPresetUI(3);
    }
  }

  // Roda ao carregar a página normalmente
  carregarPresetSalvo();

  // Roda também quando a página é exibida via back/forward (resolve bfcache)
  window.addEventListener('pageshow', () => {
    console.log("pageshow fired — re-carregando preset salvo");
    carregarPresetSalvo();
  });

});

// logout (fora do DOMContentLoaded para garantir binding)
document.getElementById('logout').addEventListener('click', () => authenticate.logout());
