// document.addEventListener('DOMContentLoaded', () => {
//     // Seleciona todos os botões e adiciona um evento de clique
//     const buttons = document.querySelectorAll('.btn');
    
//     buttons.forEach(button => {
//         button.addEventListener('click', () => {
//             const buttonText = button.textContent.trim();
//             alert(Ação "${buttonText}" acionada!);
//         });
//     });

//     // Adiciona evento de clique aos presets disponíveis
//     const presetCards = document.querySelectorAll('.preset-card');

//     presetCards.forEach(card => {
//         card.addEventListener('click', () => {
//             const presetName = card.querySelector('p').textContent.trim();
//             alert(Preset "${presetName}" selecionado! A interface seria atualizada aqui.);
//             // Em uma aplicação real, aqui você atualizaria a seção "Preset ativo"
//             // com os detalhes do preset selecionado.
//         });
//     });
// });