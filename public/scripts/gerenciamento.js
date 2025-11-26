import services from "../services/index.js"

import authenticate from "./authenticate.js"

document.addEventListener('DOMContentLoaded', () => {
		authenticate.validateAuth()

    if (authenticate.isAdm()) {
      document.getElementById('linkGerenciamento').style.display = 'block'
    }

		preencheTabelaLogs()
    preencheTabelaPermissoes()
})

document.getElementById('logout').addEventListener('click', () => authenticate.logout())

const preencheTabelaLogs = async () => {
	const dados = await services.api.logsDeAtividade.get({ id: '' });
	const tbody = document.getElementById("conteudoLogs");

	if (tbody) {
			tbody.innerHTML = '';
	}

	if (tbody && dados && dados.length > 0) {
			dados.forEach(dado => {
				const novaLinha = document.createElement('tr');

        const formatadorDeData = new Intl.DateTimeFormat('pt-BR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });

				const valores = [
					formatadorDeData.format(new Date(dado.data)),
					dado.tipo,
					dado.nomeDispositivo,
					dado.nomeUsuario
				];

				valores.forEach(valor => {
					const novaCelula = document.createElement('td');
					novaCelula.textContent = valor;
					novaLinha.appendChild(novaCelula);
				});

				tbody.appendChild(novaLinha);
			});
	} else if (tbody) {
		const linhaVazia = document.createElement('tr');
		const celulaVazia = document.createElement('td');
		celulaVazia.setAttribute('colspan', 4);
		celulaVazia.textContent = 'Nenhum log de atividade encontrado.';
		linhaVazia.appendChild(celulaVazia);
		tbody.appendChild(linhaVazia);
	}
}

const preencheTabelaPermissoes = async () => {
	const dados = await services.api.permissoes.get({ id: '' });
	const tbody = document.getElementById("conteudoPermissoes");

	if (tbody) {
			tbody.innerHTML = '';
	}

	if (tbody && dados && dados.length > 0) {
			dados.forEach(dado => {
				const novaLinha = document.createElement('tr');

				const valores = [
					dado.nomePerfil,
					dado.nomePermissao,
					dado.prioridade
				];

				valores.forEach(valor => {
					const novaCelula = document.createElement('td');
					novaCelula.textContent = valor;
					novaLinha.appendChild(novaCelula);
				});

				tbody.appendChild(novaLinha);
			});
	} else if (tbody) {
		const linhaVazia = document.createElement('tr');
		const celulaVazia = document.createElement('td');
		celulaVazia.setAttribute('colspan', 3);
		celulaVazia.textContent = 'Nenhuma permissão encontrada.';
		linhaVazia.appendChild(celulaVazia);
		tbody.appendChild(linhaVazia);
	}
}