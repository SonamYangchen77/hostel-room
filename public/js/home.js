document.addEventListener('DOMContentLoaded', () => {
  const checkAvailabilityBtn = document.getElementById('checkAvailabilityBtn');
  const modal = document.getElementById('availabilityFormModal');
  const closeModalBtn = modal.querySelector('.close-modal');
  const genderSelect = document.getElementById('gender');
  const hostelPreferenceSelect = document.getElementById('hostelPreference');
  const availabilityForm = document.getElementById('availabilityForm');

  // Define hostels by gender
  const hostelsByGender = {
    male: [
      { value: 'Rabtenling', text: 'Rabtenling (Male)' },
      { value: 'Yoentenling', text: 'Yoentenling (Male)' }
    ],
    female: [
      { value: 'Norbuling', text: 'Norbuling (Female)' },
      { value: 'Yeatsholing', text: 'Yeatsholing (Female)' }
    ]
  };

  // Open modal on button click
  checkAvailabilityBtn.addEventListener('click', () => {
    modal.style.display = 'block';
    // Clear previous options except the default placeholder
    hostelPreferenceSelect.innerHTML = '<option value="">Select a hostel...</option>';
    genderSelect.value = ''; // reset gender select
  });

  // Close modal
  closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // When user clicks outside modal content, close modal
  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });

  // Populate hostels based on selected gender
  genderSelect.addEventListener('change', () => {
    const selectedGender = genderSelect.value;
    // Clear previous hostels
    hostelPreferenceSelect.innerHTML = '<option value="">Select a hostel...</option>';

    if (selectedGender && hostelsByGender[selectedGender]) {
      hostelsByGender[selectedGender].forEach(hostel => {
        const option = document.createElement('option');
        option.value = hostel.value;
        option.textContent = hostel.text;
        hostelPreferenceSelect.appendChild(option);
      });
    }
  });

  // Handle form submission
  availabilityForm.addEventListener('submit', (event) => {
    event.preventDefault(); // prevent form submission

    const gender = genderSelect.value;
    const hostel = hostelPreferenceSelect.value;
    const roomNumber = document.getElementById('roomNumber').value;

    if (!gender || !hostel) {
      alert('Please select both gender and hostel preference.');
      return;
    }

    // You can add your availability checking logic here
    alert(`Checking availability for:\nGender: ${gender}\nHostel: ${hostel}\nRoom Number: ${roomNumber || 'Any'}`);

    // Close modal after submission (optional)
    modal.style.display = 'none';

    // Optionally reset form
    availabilityForm.reset();
    hostelPreferenceSelect.innerHTML = '<option value="">Select a hostel...</option>';
  });
});
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('availabilityFormModal');
  const openBtn = document.getElementById('checkAvailabilityBtn');
  const closeBtn = modal.querySelector('.close-modal');

  openBtn.addEventListener('click', () => {
    modal.style.display = 'block';
  });

  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Close modal if clicked outside content
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
});
