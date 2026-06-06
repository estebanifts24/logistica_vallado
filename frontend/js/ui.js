export const renderTable = ({ title, columns, data, actions = [] }) => {
  const content = document.getElementById("content");

  const hasActions = actions.length > 0;

  // 🔥 FIX CLAVE: asegurar que data siempre sea array
  if (!Array.isArray(data)) {
    console.warn("renderTable: data no es array", data);
    data = [];
  }

  content.innerHTML = `
  <div class="table-header">

    <h2>${title}</h2>

    <input
      type="text"
      id="tableSearch"
      placeholder="🔍 Buscar..."
    >

  </div>
    <table class="table">
      <thead>
        <tr>
          ${columns.map(col => `<th>${col}</th>`).join("")}
          ${hasActions ? "<th>Acciones</th>" : ""}
        </tr>
      </thead>

      <tbody>
        ${data.map((row, index) => `
          <tr>
            ${columns.map(col => `<td>${row[col] ?? "-"}</td>`).join("")}

            ${hasActions ? `
              <td>
                ${actions.map(a => `
                  <button 
                    data-action="${a.name}" 
                    data-index="${index}"
                  >
                    ${a.label}
                  </button>
                `).join("")}
              </td>
            ` : ""}
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;

/* =========================================================
   2.1 FILTRO DE BÚSQUEDA
   ========================================================= */
const searchInput = document.getElementById("tableSearch");

if (searchInput) {
  searchInput.addEventListener("input", () => {

    const texto = searchInput.value.toLowerCase();

    document
      .querySelectorAll(".table tbody tr")
      .forEach(row => {

        const contenido = row.innerText.toLowerCase();

        row.style.display =
          contenido.includes(texto)
            ? ""
            : "none";
      });

  });
}



  // ------------------------
  // EVENTOS
  // ------------------------
  if (hasActions) {
    document.querySelectorAll("button[data-action]").forEach(btn => {
      btn.onclick = () => {
        const action = btn.dataset.action;
        const index = Number(btn.dataset.index);

        const item = data[index];

        console.log("👉 CLICK:", action, item);

        const actionObj = actions.find(a => a.name === action);

        if (!actionObj) {
          console.warn("⚠️ Acción no encontrada:", action);
          return;
        }

        actionObj.handler(item);
      };
    });
  }
};