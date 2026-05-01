export const renderTable = ({ title, columns, data, actions = [] }) => {
  const content = document.getElementById("content");

  const hasActions = actions.length > 0;

  content.innerHTML = `
    <h2>${title}</h2>

    <table class="table">
      <thead>
        <tr>
          ${columns.map(col => `<th>${col}</th>`).join("")}
          ${hasActions ? "<th>Acciones</th>" : ""}
        </tr>
      </thead>

      <tbody>
        ${data.map((row) => `
          <tr>
            ${columns.map(col => `<td>${row[col] ?? ""}</td>`).join("")}

            ${hasActions ? `
              <td>
                ${actions.map(a => `
                  <button 
                    data-action="${a.name}" 
                    data-id="${row.id}"
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

  // eventos
  if (hasActions) {
    document.querySelectorAll("button[data-action]").forEach(btn => {
      btn.onclick = () => {
        const action = btn.dataset.action;
        const id = btn.dataset.id;

        const item = data.find(d => d.id === id);

        actions.find(a => a.name === action)?.handler(item);
      };
    });
  }
};