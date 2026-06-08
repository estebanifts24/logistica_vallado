/*  VARIABLES ORDENAMIENTO */

let sortColumn = null;
let sortDirection = "asc";

// RENDER TABLE
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

</div>

<div class="table-toolbar">

  <div id="tableActions"></div>

  <input
    type="text"
    id="tableSearch"
    placeholder="🔍 Buscar..."
  >

</div>
    <table class="table">
      <thead>
        <tr>
          ${columns.map(col => `
  <th
    class="sortable-header"
    data-column="${col}"
  >
    ${col}
  </th>
`).join("")}
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

/* =========================================================
   2.2 ORDENAMIENTO
   ========================================================= */

document
  .querySelectorAll(".sortable-header")
  .forEach(header => {

    header.onclick = () => {

      const column = header.dataset.column;

      if (sortColumn === column) {

        sortDirection =
          sortDirection === "asc"
            ? "desc"
            : "asc";

      } else {

        sortColumn = column;
        sortDirection = "asc";

      }

      const sortedData = [...data].sort((a, b) => {

        const valorA = a[column];
const valorB = b[column];

if (
  !isNaN(valorA) &&
  !isNaN(valorB)
) {

  return sortDirection === "asc"
    ? Number(valorA) - Number(valorB)
    : Number(valorB) - Number(valorA);

}

const textoA =
  String(valorA ?? "").toLowerCase();

const textoB =
  String(valorB ?? "").toLowerCase();

return sortDirection === "asc"
  ? textoA.localeCompare(textoB, "es")
  : textoB.localeCompare(textoA, "es");

      });

      const tbody =
        document.querySelector(".table tbody");

      tbody.innerHTML = sortedData.map((row, index) => `
        <tr>

          ${columns.map(col =>
            `<td>${row[col] ?? "-"}</td>`
          ).join("")}

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
      `).join("");

      document
        .querySelectorAll("button[data-action]")
        .forEach(btn => {

          btn.onclick = () => {

            const action =
              btn.dataset.action;

            const index =
              Number(btn.dataset.index);

            const item =
              sortedData[index];

            const actionObj =
              actions.find(a =>
                a.name === action
              );

            if (!actionObj) return;

            actionObj.handler(item);

          };

        });

    };

  });


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