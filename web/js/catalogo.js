const BASE_URL = "http://localhost:3000";

let vallasOriginales = [];

function getImageByTipo(tipo) {
  if (!tipo) {
    return "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800";
  }

  const t = tipo.toLowerCase();

  if (t.includes("cont")) {
    return "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800";
  }

  if (t.includes("pea")) {
    return "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800";
  }

  if (t.includes("anti")) {
    return "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=800";
  }

  return "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800";
}

function renderCatalogo(vallas) {
  const container = document.getElementById("catalogoContainer");
  container.innerHTML = "";

  vallas.forEach(valla => {
    container.innerHTML += `
      <div class="col-md-4">
        <div class="card shadow h-100 border-0 catalogo-card">
          <img src="${getImageByTipo(valla.tipo)}" class="card-img-top">

          <div class="card-body d-flex flex-column">
            <span class="badge bg-warning text-dark mb-3">
              ${valla.tipo || "Sin tipo"}
            </span>

            <h5 class="card-title fw-bold">${valla.codigo}</h5>

            <p class="card-text flex-grow-1">
              ${valla.descripcion}
            </p>

            <button class="btn btn-dark w-100 mt-3">
              Consultar
            </button>
          </div>
        </div>
      </div>
    `;
  });
}

function cargarFiltros() {
  const select = document.getElementById("filtroTipo");

  const tipos = [...new Set(
    vallasOriginales
      .map(v => v.tipo)
      .filter(Boolean)
  )];

  tipos.forEach(tipo => {
    select.innerHTML += `<option value="${tipo}">${tipo}</option>`;
  });
}

function aplicarFiltros() {
  const texto = document.getElementById("buscador").value.toLowerCase();
  const tipo = document.getElementById("filtroTipo").value;

  const filtradas = vallasOriginales.filter(v => {
    const matchTexto =
      !texto ||
      v.codigo?.toLowerCase().includes(texto) ||
      v.descripcion?.toLowerCase().includes(texto) ||
      v.tipo?.toLowerCase().includes(texto);

    const matchTipo = !tipo || v.tipo === tipo;

    return matchTexto && matchTipo;
  });

  renderCatalogo(filtradas);
}

async function cargarCatalogo() {
  try {
    const response = await fetch(`${BASE_URL}/api/vallas`);
    const data = await response.json();

    vallasOriginales = data.data || data;

    renderCatalogo(vallasOriginales);
    cargarFiltros();

    document
      .getElementById("buscador")
      .addEventListener("input", aplicarFiltros);

    document
      .getElementById("filtroTipo")
      .addEventListener("change", aplicarFiltros);

  } catch (error) {
    console.error("Error cargando catálogo:", error);
  }
}

cargarCatalogo();