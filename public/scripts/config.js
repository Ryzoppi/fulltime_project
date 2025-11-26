import authenticate from "./authenticate.js"

document.addEventListener('DOMContentLoaded', () => {
  authenticate.validateAuth()

  if (authenticate.isAdm()) {
    document.getElementById('linkGerenciamento').style.display = 'block'
  }

  const buttons = document.querySelectorAll('.btn'); 
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const buttonText = button.textContent.trim();
      alert("Ação " + buttonText + " acionada!");
    });
  });
  const presetCards = document.querySelectorAll('.preset-card');
  presetCards.forEach(card => {
    card.addEventListener('click', () => {
      const presetName = card.querySelector('p').textContent.trim();
      alert("Preset " + presetName + " selecionado! A interface seria atualizada aqui.");
    });
  });
});

document.getElementById('logout').addEventListener('click', () => authenticate.logout())