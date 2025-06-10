document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  const hostelFilter = document.getElementById('hostelFilter');
  const table = document.getElementById('reportTable');
  const downloadBtn = document.getElementById('downloadBtn');

  function filterTable() {
    const searchText = searchInput.value.toLowerCase();
    const selectedHostel = hostelFilter.value.toLowerCase();

    const rows = table.tBodies[0].rows;

    for (let row of rows) {
      const id = row.cells[0].textContent.toLowerCase();
      const name = row.cells[1].textContent.toLowerCase();
      const studentId = row.cells[2].textContent.toLowerCase();
      const email = row.cells[3].textContent.toLowerCase();
      const contact = row.cells[4].textContent.toLowerCase();
      const hostel = row.cells[5].textContent.toLowerCase();
      const room = row.cells[6].textContent.toLowerCase();

      const matchesSearch =
        id.includes(searchText) ||
        name.includes(searchText) ||
        studentId.includes(searchText) ||
        email.includes(searchText) ||
        contact.includes(searchText) ||
        room.includes(searchText);

      const matchesHostel = selectedHostel === '' || hostel === selectedHostel;

      if (matchesSearch && matchesHostel) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    }
  }

  function downloadCSV() {
    // Only download rows currently visible (not display:none)
    const rows = Array.from(table.querySelectorAll('thead tr, tbody tr'))
      .filter(row => row.style.display !== 'none');

    const csvContent = rows.map(row => {
      const cells = Array.from(row.querySelectorAll('th, td'));
      return cells.map(cell => {
        // Escape quotes and wrap with quotes for CSV safety
        const text = cell.textContent.trim().replace(/"/g, '""');
        return `"${text}"`;
      }).join(',');
    }).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'student_report.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Event listeners
  searchInput.addEventListener('input', filterTable);
  hostelFilter.addEventListener('change', filterTable);
  downloadBtn.addEventListener('click', downloadCSV);

  // Initial filter call to show all rows
  filterTable();
});
