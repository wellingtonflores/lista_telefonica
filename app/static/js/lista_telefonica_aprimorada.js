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
    if (orgao.divisoes.length > 0 || orgao.setores.length > 0) {
      const card = document.createElement("div");
      card.className = "card";
      card.dataset.municipio = orgao.cidade || "";

      const header = document.createElement("div");
      header.className = "card-header";
      header.style.display = "flex";
      header.style.alignItems = "center";

      const tituloWrapper = document.createElement("div");
      tituloWrapper.style.display = "flex";
      tituloWrapper.style.alignItems = "baseline";
      tituloWrapper.style.flexShrink = "0";
      tituloWrapper.style.whiteSpace = "nowrap";
      tituloWrapper.style.overflow = "hidden";
      tituloWrapper.style.textOverflow = "ellipsis";

      const titulo = document.createElement("h2");
      titulo.textContent = orgao.nomeOrgao || "Nome não informado";
      titulo.style.margin = "0";

      const spanId = document.createElement("small");
      spanId.textContent = ` (${orgao.idOrgao || ""})`;
      spanId.style.fontWeight = "normal";
      spanId.style.marginLeft = "4px";

      tituloWrapper.append(titulo, spanId);

      const telefoneSpan = document.createElement("span");
      telefoneSpan.textContent =
        orgao.telefone?.trim() || "Telefone não informado";
      telefoneSpan.style.flex = "1";
      telefoneSpan.style.textAlign = "center";

      const emailSpan = document.createElement("span");
      emailSpan.textContent = orgao.email?.trim() || "Email não informado";
      emailSpan.style.flex = "0";
      emailSpan.style.margin = "0 1rem 0 0";

      const btnToggle = document.createElement("button");
      btnToggle.textContent = "⇩";
      btnToggle.className = "btn-toggle";
      btnToggle.style.flex = "0";

      header.innerHTML = "";
      header.append(tituloWrapper, telefoneSpan, emailSpan, btnToggle);
      card.appendChild(header);

      const body = document.createElement("div");
      body.className = "card-body";

      const endereco = document.createElement("div");
      endereco.className = "address";
      const numeroECpl = orgao.complemento
        ? `${orgao.numeroOrgao}, ${orgao.complemento}`
        : `${orgao.numeroOrgao}`;

      endereco.textContent = orgao.cep
        ? `${orgao.logradouroOrgao}, ${numeroECpl} — ${orgao.cidade || ""}`
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
    }
  });
}

function inicializarBusca(orgaos) {
  const titleContainer = document.getElementsByClassName("title")[0];

  const inputBusca = document.createElement("input");
  inputBusca.id = "busca";
  inputBusca.placeholder = "Número do órgão";
  inputBusca.className = "search-input";
  inputBusca.style.marginLeft = "10px";

  const selectMunicipio = document.createElement("select");
  selectMunicipio.id = "filtro-municipio";
  selectMunicipio.className = "select-municipio";
  selectMunicipio.style.marginLeft = "10px";

  const municipios = [...new Set(orgaos.map((o) => o.cidade))].sort();
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
