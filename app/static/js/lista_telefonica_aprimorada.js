document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("http://127.0.0.1:5000/api/orgao");

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const orgaos = await response.json();
    renderizarOrgaos(orgaos);
    inicializarBusca(orgaos);
  } catch (error) {
    console.error("Falha ao carregar órgãos: ", error);
    document.getElementById("container").innerHTML = `
      <div class="card error">
        <h2>Erro ao carregar dados</h2>
        <div class="address">Tente recarregar a página</div>
      </div>
    `;
  }
});

function renderizarOrgaos(orgaos) {
  const container = document.getElementById("container");

  orgaos.forEach((orgao) => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.municipio = orgao.municipio || "";

    const header = document.createElement("div");
    header.className = "card-header";
    header.innerHTML = `<h2>${orgao.nomeOrgao || "Nome não informado"}</h2>`;
    const btnToggle = document.createElement("button");
    btnToggle.textContent = "⇩";
    btnToggle.className = "btn-toggle";
    header.appendChild(btnToggle);
    card.appendChild(header);

    const body = document.createElement("div");
    body.className = "card-body";

    const endereco = document.createElement("div");
    endereco.className = "address";
    endereco.textContent = orgao.enderecoOrgao
      ? `${orgao.enderecoOrgao} — ${orgao.municipio || ""}`
      : "Endereço não informado";
    body.appendChild(endereco);

    if (orgao.divisoes.length === 0) {
      const ul = document.createElement("ul");
      ul.className = "contact-list";
      orgao.setores.forEach((setor) => {
        const li = document.createElement("li");
        li.innerHTML = `<span class="label">${setor.nomeSetor}</span>
                        <span class="phone">${setor.telefoneSetor}</span>`;
        ul.appendChild(li);
      });
      body.appendChild(ul);
    } else if (orgao.divisoes.length > 0 && orgao.setores.length > 0) {
      const setoresUl = document.createElement("ul");
      setoresUl.className = "contact-list";
      orgao.setores.forEach((setor) => {
        const li = document.createElement("li");
        li.innerHTML = `
      <span class="label">${setor.nomeSetor}</span>
      <span class="phone">${setor.telefoneSetor}</span>`;
        setoresUl.appendChild(li);
      });
      body.appendChild(setoresUl);

      orgao.divisoes.forEach((divisao) => {
        const divTitle = document.createElement("div");
        divTitle.className = "division";
        divTitle.textContent = divisao.nomeDivisao;
        body.appendChild(divTitle);

        const ul = document.createElement("ul");
        ul.className = "contact-list";
        divisao.setores.forEach((setor) => {
          const li = document.createElement("li");
          li.innerHTML = `<span class="label">${setor.nomeSetor}</span>
                          <span class="phone">${setor.telefoneSetor}</span>`;
          ul.appendChild(li);
        });
        body.appendChild(ul);
      });
    } else {
      orgao.divisoes.forEach((divisao) => {
        const divTitle = document.createElement("div");
        divTitle.className = "division";
        divTitle.textContent = divisao.nomeDivisao;
        body.appendChild(divTitle);

        const ul = document.createElement("ul");
        ul.className = "contact-list";
        divisao.setores.forEach((setor) => {
          const li = document.createElement("li");
          li.innerHTML = `<span class="label">${setor.nomeSetor}</span>
                          <span class="phone">${setor.telefoneSetor}</span>`;
          ul.appendChild(li);
        });
        body.appendChild(ul);
      });
    }

    card.appendChild(body);
    container.appendChild(card);

    btnToggle.addEventListener("click", () => {
      const isCollapsed = body.classList.toggle("collapsed");
      btnToggle.textContent = isCollapsed ? "⇨" : "⇩";
    });
  });
}

function inicializarBusca(orgaos) {
  const titleContainer = document.getElementsByClassName("title")[0];

  const inputBusca = document.createElement("input");
  inputBusca.id = "busca";
  inputBusca.placeholder = "Buscar órgão";
  inputBusca.className = "search-input";
  inputBusca.style.marginLeft = "10px";

  const selectMunicipio = document.createElement("select");
  selectMunicipio.id = "filtro-municipio";
  selectMunicipio.className = "select-municipio";
  selectMunicipio.style.marginLeft = "10px";

  const municipios = [...new Set(orgaos.map((o) => o.municipio))].sort();
  selectMunicipio.innerHTML =
    `<option value="">Todos os municípios</option>` +
    municipios.map((m) => `<option value="${m}">${m}</option>`).join("");

  const dataList = document.createElement("datalist");
  dataList.id = "orgaos-sugestoes";
  orgaos.forEach((o) => {
    const opt = document.createElement("option");
    opt.value = o.nomeOrgao;
    dataList.appendChild(opt);
  });

  titleContainer.appendChild(selectMunicipio);
  titleContainer.appendChild(inputBusca);
  document.body.appendChild(dataList);
  inputBusca.setAttribute("list", "orgaos-sugestoes");

  function atualizarFiltros(evento) {
    if (evento.target === inputBusca) {
      selectMunicipio.disabled = !!inputBusca.value;
    } else {
      inputBusca.disabled = !!selectMunicipio.value;
    }
  }

  function filtrarCards() {
    const termo = inputBusca.value.toLowerCase();
    const mun = selectMunicipio.value;

    document.querySelectorAll(".card").forEach((card) => {
      let visivel = true;

      // filtro por texto
      if (inputBusca.value) {
        const txt = card.textContent.toLowerCase();
        visivel = visivel && txt.includes(termo);
      }

      // filtro por município
      if (selectMunicipio.value) {
        visivel = visivel && card.dataset.municipio === mun;
      }

      card.style.display = visivel ? "block" : "none";
    });
  }

  inputBusca.addEventListener("input", (e) => {
    atualizarFiltros(e);
    filtrarCards();
  });
  selectMunicipio.addEventListener("change", (e) => {
    atualizarFiltros(e);
    filtrarCards();
  });
}
