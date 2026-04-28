export const renderTable = ({ title, columns, data, actions = [] }) => {
  const content = document.getElementById("content");

  const actionHeader = actions.length ? "<th>Acciones</th>" : "";

  content.innerHTML = `
    <h2>${title}</h2>

    <table class="table">
      <thead>
        <tr>
          ${columns.map(col => `<th>${col}</th>`).join("")}
          ${actionHeader}
        </tr>
      </thead>

      <tbody>
        ${data.map((row, index) => `
          <tr>
            ${columns.map(col => `<td>${row[col] ?? ""}</td>`).join("")}

            ${
              actions.length
                ? `<td>
                    ${actions.map(a =>
                      `<button data-action="${a.name}" data-index="${index}">
                        ${a.label}
                      </button>`
                    ).join("")}
                   </td>`
                : ""
            }
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;

  // eventos de acciones
  if (actions.length) {
    document.querySelectorAll("button[data-action]").forEach(btn => {
      btn.onclick = () => {
        const action = btn.dataset.action;
        const index = btn.dataset.index;

        actions.find(a => a.name === action)?.handler(data[index]);
      };
    });
  }
};