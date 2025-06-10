document.addEventListener('DOMContentLoaded', () => {
  const roomForm = document.getElementById('room-form');
  const hostelSelect = document.getElementById('hostel-select');
  const roomNameInput = document.getElementById('room-name');
  const isAvailableCheckbox = document.getElementById('is-available');
  const submitBtn = document.getElementById('submit-btn');
  const cancelBtn = document.getElementById('cancel-btn');
  const roomIdInput = document.getElementById('room-id');
  const successMessage = document.getElementById('success-message');
  const roomsContainer = document.getElementById('rooms-container');

  fetchRooms();

  roomForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const roomId = roomIdInput.value;
    const hostel_id = hostelSelect.value;
    const room_name = roomNameInput.value.trim();
    const is_available = isAvailableCheckbox.checked;

    if (!hostel_id || !room_name) {
      alert('Please fill all required fields');
      return;
    }

    const payload = { hostel_id, room_name, is_available };

    try {
      submitBtn.disabled = true;

      const url = roomId ? `/api/rooms/${roomId}` : '/api/rooms';
      const method = roomId ? 'PUT' : 'POST';
      console.log('Payload to send:', payload);

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error('Unexpected server response');
      }

      if (!res.ok) throw new Error(data.message || 'Something went wrong');

      showSuccess(data.message || 'Room saved');
      fetchRooms();
      resetForm();
    } catch (err) {
      alert(err.message || 'Failed to save room');
    } finally {
      submitBtn.disabled = false;
    }
  });

  cancelBtn.addEventListener('click', resetForm);

  async function fetchRooms() {
    try {
      const res = await fetch('/api/rooms');
      const rooms = await res.json();
      renderGroupedRooms(rooms);
    } catch (err) {
      alert('Failed to fetch rooms');
    }
  }

  function renderGroupedRooms(rooms) {
    const groups = {};

    rooms.forEach(room => {
      const key = `${room.hostel_name} (${room.gender})`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(room);
    });

    roomsContainer.innerHTML = '';

    Object.entries(groups).forEach(([group, roomList]) => {
      const section = document.createElement('section');
      const title = document.createElement('h2');
      title.textContent = group;
      section.appendChild(title);

      const table = document.createElement('table');
      table.innerHTML = `
        <thead>
          <tr>
            <th>Room</th>
            <th>Available</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${roomList.map(room => `
            <tr data-id="${room.id}" data-hostel="${room.hostel_id}">
              <td>${room.room_name}</td>
              <td>${room.is_available ? 'Yes' : 'No'}</td>
              <td>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      `;
      section.appendChild(table);
      roomsContainer.appendChild(section);
    });

    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tr = e.target.closest('tr');
        const id = tr.dataset.id;
        const hostel_id = tr.dataset.hostel;
        const room_name = tr.children[0].textContent;
        const is_available = tr.children[1].textContent === 'Yes';

        roomIdInput.value = id;
        hostelSelect.value = hostel_id;
        roomNameInput.value = room_name;
        isAvailableCheckbox.checked = is_available;
        submitBtn.textContent = 'Update Room';
        cancelBtn.style.display = 'inline-block';
      });
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.closest('tr').dataset.id;
        if (!confirm('Delete this room?')) return;

        try {
          const res = await fetch(`/api/rooms/${id}`, { method: 'DELETE' });
          const data = await res.json();
          showSuccess(data.message || 'Room deleted');
          fetchRooms();
        } catch (err) {
          alert('Delete failed');
        }
      });
    });
  }

  function resetForm() {
    roomIdInput.value = '';
    hostelSelect.value = '';
    roomNameInput.value = '';
    isAvailableCheckbox.checked = true;
    submitBtn.textContent = 'Add Room';
    cancelBtn.style.display = 'none';
  }

  function showSuccess(message) {
    successMessage.textContent = message;
    setTimeout(() => {
      successMessage.textContent = '';
    }, 3000);
  }
});
