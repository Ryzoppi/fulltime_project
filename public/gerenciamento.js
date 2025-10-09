document.addEventListener("DOMContentLoaded", () => {
    const main = document.getElementById("conteudo");

    async function carregarPagina(arquivo) {
        const resposta = await fetch(arquivo);
        const html = await resposta.text();
        main.innerHTML = html;
    }

    document.getElementById("linkDashboard").addEventListener("click", e => {
        e.preventDefault();
        carregarPagina("dashboard.html");
    });

    document.getElementById("linkCameras").addEventListener("click", e => {
        e.preventDefault();
        carregarPagina("cameras.html");
    });

    document.getElementById("linkAlarmes").addEventListener("click", e => {
        e.preventDefault();
        carregarPagina("alarmes.html");
    });

    document.getElementById("linkConfig").addEventListener("click", e => {
        e.preventDefault();
        carregarPagina("config.html");
    });
});
