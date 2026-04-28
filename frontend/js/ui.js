export const renderTable = ({ title, columns, data }) => {
  const content = document.getElementById("content");

  content.innerHTML = `
    <h2>${title}</h2>

    <table class="table">
      <thead>
        <tr>
          ${columns.map(col => `<th>${col}</th>`).join("")}
        </tr>
      </thead>

      <tbody>
        ${data.map(row => `
          <tr>
            ${columns.map(col => `<td>${row[col] ?? ""}</td>`).join("")}
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
};