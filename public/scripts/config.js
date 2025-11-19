import authenticate from "./authenticate.js"

document.addEventListener('DOMContentLoaded', () => {
    authenticate.validateAuth()

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