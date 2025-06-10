document.addEventListener('DOMContentLoaded', () => {
  // Confirmation on all form submissions (Approve & Decline)
  const forms = document.querySelectorAll('.actions form');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      const action = form.querySelector('button[type="submit"]').textContent.toLowerCase();
      if (!confirm(`Are you sure you want to ${action} this application?`)) {
        e.preventDefault();
      }
    });
  });

  // Toggle reason input and buttons for decline forms
  const declineForms = document.querySelectorAll('.decline-form');

  declineForms.forEach(form => {
    const toggleBtn = form.querySelector('.toggle-reason-btn');
    const reasonInput = form.querySelector('input[name="reason"]');
    const submitBtn = form.querySelector('.submit-decline-btn');
    const cancelBtn = form.querySelector('.cancel-decline-btn');

    // Show reason input + Submit + Cancel, hide Decline button
    toggleBtn.addEventListener('click', () => {
      toggleBtn.style.display = 'none';
      reasonInput.style.display = 'inline-block';
      submitBtn.style.display = 'inline-block';
      cancelBtn.style.display = 'inline-block';
      reasonInput.focus();
    });

    // Cancel button hides input + Submit + Cancel, shows Decline button again
    cancelBtn.addEventListener('click', () => {
      reasonInput.style.display = 'none';
      submitBtn.style.display = 'none';
      cancelBtn.style.display = 'none';
      toggleBtn.style.display = 'inline-block';
      reasonInput.value = ''; // clear input
    });
  });
});
