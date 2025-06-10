document.addEventListener('DOMContentLoaded', () => {
  // Search functionality
  const searchInput = document.querySelector('.search-bar input');
  if (searchInput) {
    searchInput.addEventListener('input', debounce((e) => {
      const searchTerm = e.target.value.toLowerCase();
      filterStudents(searchTerm);
    }, 300));
  }

  // Hostel filter
  const hostelFilter = document.querySelector('.hostel-filter');
  if (hostelFilter) {
    hostelFilter.addEventListener('change', (e) => {
      const hostel = e.target.value;
      filterByHostel(hostel);
    });
  }

  // Attach listeners for edit and delete buttons on initial page load
  attachEventListeners();

  // Helper functions
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  function filterStudents(searchTerm) {
    const rows = document.querySelectorAll('tbody tr');
    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
  }

  // Placeholder for fetchAllStudents - reloads all students without filters
  function fetchAllStudents() {
    fetch('/api/students')
      .then(response => response.json())
      .then(data => updateStudentTable(data))
      .catch(error => console.error('Error:', error));
  }

  function filterByHostel(hostel) {
    if (hostel === 'all') {
      fetchAllStudents();
      return;
    }

    fetch(`/api/students?hostel=${hostel}`)
      .then(response => response.json())
      .then(data => updateStudentTable(data))
      .catch(error => console.error('Error:', error));
  }

  function editStudent(studentId) {
    window.location.href = `/students/edit/${studentId}`;
  }

  function deleteStudent(studentId) {
    if (confirm('Are you sure you want to delete this student record?')) {
      fetch(`/api/students/${studentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(async response => {
          const text = await response.text();
          console.log('Response text:', text);  // <-- Debug: logs server response as text

          try {
            const data = JSON.parse(text);  // Try parsing JSON from the text
            if (response.ok && data.success) {
              const row = document.querySelector(`tr[data-id="${studentId}"]`);
              if (row) {
                row.remove();
              }
              alert(data.message || 'Student deleted successfully.');
            } else {
              alert('Delete failed: ' + (data.message || 'Unknown server error'));
            }
          } catch (err) {
            throw new Error('Invalid JSON response from server.');
          }
        })
        .catch(error => {
          console.error('Fetch error:', error);
          alert('Error deleting student: ' + error.message);
        });
    }
  }


  function updateStudentTable(students) {
    const tbody = document.querySelector('tbody');
    tbody.innerHTML = students.map(student => `
      <tr data-id="${student.id}">
        <td class="student-info">
          <div class="avatar">${student.name.charAt(0)}</div>
          <span>${student.name}</span>
        </td>
        <td>${student.id}</td>
        <td>${student.email}</td>
        <td>${student.room || '-'}</td>
        <td>${student.course || '-'}</td>
        <td>
          <span class="status-badge ${student.status ? student.status.toLowerCase() : ''}">
            ${student.status || '-'}
          </span>
        </td>
        <td class="actions">
          <button class="edit-btn" data-id="${student.id}">✏️</button>
          <button class="delete-btn" data-id="${student.id}">🗑️</button>
        </td>
      </tr>
    `).join('');

    attachEventListeners(); // Reattach events to new buttons
  }

  function attachEventListeners() {
    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.removeEventListener('click', handleEdit); // remove old listeners just in case
      btn.addEventListener('click', handleEdit);
    });
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.removeEventListener('click', handleDelete); // remove old listeners just in case
      btn.addEventListener('click', handleDelete);
    });
  }

  function handleEdit(e) {
    editStudent(e.target.dataset.id);
  }

  function handleDelete(e) {
    deleteStudent(e.target.dataset.id);
  }
});
