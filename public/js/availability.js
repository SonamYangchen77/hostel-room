document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('applyModal');
  const applyButtons = document.querySelectorAll('.apply-btn');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const cancelApplyBtn = document.getElementById('cancelApplyBtn');
  const applyForm = document.getElementById('applyForm');
  const applyRoomNameInput = document.getElementById('applyRoomName');
  const applyHostelNameInput = document.getElementById('applyHostelName');

  // Open modal and populate hidden inputs
  applyButtons.forEach(button => {
    button.addEventListener('click', () => {
      applyRoomNameInput.value = button.dataset.room;
      applyHostelNameInput.value = button.dataset.hostel;
      modal.classList.add('show');
      modal.classList.remove('hidden');
    });
  });

  // Close modal function
  const closeModal = () => {
    modal.classList.remove('show');
    modal.classList.add('hidden');
    applyForm.reset();
  };

  // Close on X or Cancel buttons
  closeModalBtn.addEventListener('click', closeModal);
  cancelApplyBtn.addEventListener('click', closeModal);

  // Close modal if clicking outside content box
  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  // Handle form submission
  applyForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(applyForm);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert(result.message);
        closeModal();
      } else {
        alert('❌ ' + (result.message || 'Application failed.'));
      }
    } catch (err) {
      console.error('❌ Error submitting application:', err);
      alert('❌ Network error. Please try again.');
    }
  });
});
