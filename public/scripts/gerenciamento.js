import services from "../services/index.js";
import authenticate from "./authenticate.js";

const handleExcluir = async (tipoEntidade, id, preencherTabela) => {
  if (
    confirm(
      `Tem certeza que deseja excluir o item ID ${id} de ${tipoEntidade}?`
    )
  ) {
    try {
      const resultado = await services.api[tipoEntidade].destroy({ id });

      console.log(resultado);

      if (resultado && !resultado.status) {
        alert(`${tipoEntidade} excluída(o) com sucesso!`);
        await preencherTabela();
        if (tipoEntidade === "permissoes") {
          preencheTabela("perfis");
        }
      } else {
        alert(
          `Erro ao excluir ${tipoEntidade}: ${
            resultado.mensagem || "Resposta inválida da API."
          }`
        );
      }
    } catch (error) {
      console.error(`Erro ao excluir ${tipoEntidade} ID ${id}:`, error);
      alert(`Erro na comunicação com a API ao excluir ${tipoEntidade}.`);
    }
  }
};

const handleCriar = async (
  event,
  tipoEntidade,
  idFormulario,
  preencherTabela,
  processarDados = (data) => data
) => {
  event.preventDefault();

  const form = document.getElementById(idFormulario);
  const formData = new FormData(form);
  const dados = {};

  formData.forEach((value, key) => {
    dados[key] = value;
  });

  const dadosFinais = processarDados(dados);

  if (idFormulario === "cadastroEmpresaForm") {
    const documento = dadosFinais.documento
      ? dadosFinais.documento.replace(/\D/g, "")
      : "";
    if (documento.length !== 11 && documento.length !== 14) {
      alert(
        "Erro: O Documento deve ter 11 dígitos (CPF) ou 14 dígitos (CNPJ), somente números."
      );
      return;
    }
    dadosFinais.documento = documento;
  }

  try {
    const resultado = await services.api[tipoEntidade].create(dadosFinais);

    if (resultado && !resultado.status) {
      alert(`${tipoEntidade} criado(a) com sucesso!`);
      form.reset();
      await preencherTabela();
    } else {
      alert(
        `Erro ao criar ${tipoEntidade}: ${
          resultado.mensagem || resultado.message || "Resposta inválida da API."
        }`
      );
    }
  } catch (error) {
    console.error(`Erro ao criar ${tipoEntidade}:`, error);
    alert(`Erro na comunicação com a API ao criar ${tipoEntidade}.`);
  }
};

const preencheTabelaGenerica = async (
  idTbody,
  tipoEntidade,
  mapeadorValores,
  colspanVazio,
  incluirAcoes = true
) => {
  const dados = await services.api[tipoEntidade].get({ id: "" });
  const tbody = document.getElementById(idTbody);
  const tipoMensagem = idTbody.replace("conteudo", "");

  if (tbody) {
    tbody.innerHTML = "";
  }

  if (tbody && dados && dados.length > 0) {
    dados.forEach((dado) => {
      const novaLinha = document.createElement("tr");

      const valores = mapeadorValores(dado);
      valores.forEach((valor) => {
        const novaCelula = document.createElement("td");
        novaCelula.textContent = valor;
        novaLinha.appendChild(novaCelula);
      });

      if (incluirAcoes) {
        const celulaAcoes = document.createElement("td");
        const btnExcluir = document.createElement("button");
        btnExcluir.textContent = "Excluir";
        btnExcluir.classList.add("btnExcluir");

        btnExcluir.addEventListener("click", () => {
          handleExcluir(tipoEntidade, dado.id, () =>
            preencheTabela(tipoEntidade)
          );
        });

        celulaAcoes.appendChild(btnExcluir);
        novaLinha.appendChild(celulaAcoes);
      }

      tbody.appendChild(novaLinha);
    });
  } else if (tbody) {
    const linhaVazia = document.createElement("tr");
    const celulaVazia = document.createElement("td");
    celulaVazia.setAttribute("colspan", colspanVazio);
    celulaVazia.textContent = `Nenhum(a) ${tipoMensagem} encontrado(a).`;
    linhaVazia.appendChild(celulaVazia);
    tbody.appendChild(linhaVazia);
  }
};

const formatadorDeData = new Intl.DateTimeFormat("pt-BR", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const funcoesPreencher = {
  logsDeAtividade: () =>
    preencheTabelaGenerica(
      "conteudoLogs",
      "logsDeAtividade",
      (dado) => [
        dado.id,
        dado.nomeDispositivo,
        dado.nomeUsuario,
        dado.tipo,
        formatadorDeData.format(new Date(dado.data)),
      ],
      5,
      false
    ),
  empresas: () =>
    preencheTabelaGenerica(
      "conteudoEmpresas",
      "empresas",
      (dado) => [dado.id, dado.nome, dado.documento],
      4
    ),
  permissoes: () =>
    preencheTabelaGenerica(
      "conteudoPermissoes",
      "permissoes",
      (dado) => [dado.id, dado.nome, dado.prioridade],
      4
    ),
  usuarios: () =>
    preencheTabelaGenerica(
      "conteudoUsuarios",
      "usuarios",
      (dado) => [
        dado.id,
        dado.nome,
        dado.email,
        dado.nomeEmpresa,
        dado.nomePerfil,
      ],
      6
    ),
  dispositivos: () =>
    preencheTabelaGenerica(
      "conteudoDispositivos",
      "dispositivos",
      (dado) => [dado.id, dado.nome, dado.tipo, dado.nomeEmpresa],
      5
    ),
  perfis: () =>
    preencheTabelaGenerica(
      "conteudoPerfis",
      "perfis",
      (dado) => [dado.id, dado.nome, dado?.permissoesPerfil || "-"],
      4
    ),
};

const preencheTabela = (tipoEntidade) => funcoesPreencher[tipoEntidade]();

document.addEventListener("DOMContentLoaded", () => {
  authenticate.validateAuth();

  if (authenticate.isAdm()) {
    document.getElementById("linkGerenciamento").style.display = "block";
  }

  Object.values(funcoesPreencher).forEach((fn) => fn());
  document
    .getElementById("cadastroEmpresaForm")
    .addEventListener("submit", (event) =>
      handleCriar(
        event,
        "empresas",
        "cadastroEmpresaForm",
        funcoesPreencher.empresas
      )
    );

  document
    .getElementById("cadastroPermissaoForm")
    .addEventListener("submit", (event) =>
      handleCriar(
        event,
        "permissoes",
        "cadastroPermissaoForm",
        funcoesPreencher.permissoes
      )
    );

  document
    .getElementById("cadastroPerfilForm")
    .addEventListener("submit", (event) =>
      handleCriar(
        event,
        "perfis",
        "cadastroPerfilForm",
        funcoesPreencher.perfis
      )
    );

  document
    .getElementById("cadastroUsuarioForm")
    .addEventListener("submit", (event) =>
      handleCriar(
        event,
        "usuarios",
        "cadastroUsuarioForm",
        funcoesPreencher.usuarios
      )
    );

  document
    .getElementById("cadastroDispositivoForm")
    .addEventListener("submit", (event) =>
      handleCriar(
        event,
        "dispositivos",
        "cadastroDispositivoForm",
        funcoesPreencher.dispositivos
      )
    );
});

document
  .getElementById("logout")
  .addEventListener("click", () => authenticate.logout());
