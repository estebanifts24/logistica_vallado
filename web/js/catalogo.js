const BASE_URL = "http://localhost:3000";

async function cargarCatalogo() {
  try {
    const response = await fetch(`${BASE_URL}/api/vallas`);
    const data = await response.json();

    console.log("Vallas:", data);

    const container =
      document.getElementById("catalogoContainer");

    container.innerHTML = "";

    const vallas = data.data || data;

    vallas.forEach(valla => {
      container.innerHTML += `
        <div class="col-md-4">
          <div class="card shadow h-100">
            <div class="card-body">
              <h5 class="card-title">${valla.codigo}</h5>
              <p class="card-text">
                ${valla.descripcion}
              </p>
              <span class="badge bg-warning text-dark">
                ${valla.tipo}
              </span>
            </div>
          </div>
        </div>
      `;
    });

  } catch (error) {
    console.error("Error cargando catálogo:", error);
  }
}

cargarCatalogo();