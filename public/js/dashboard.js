document.addEventListener('DOMContentLoaded', () => {
  // Search functionality
  const searchInput = document.querySelector('.search-bar input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      // Add your search logic here
      console.log('Search query:', e.target.value);
    });
  }

  // Update statistics periodically
  function updateStats() {
    fetch('/api/dashboard/stats')
      .then(response => response.json())
      .then(data => {
        // Update statistics cards
        document.querySelector('.students .stat-value').textContent = data.totalStudents;
        document.querySelector('.rooms .stat-value').textContent = data.availableRooms;
        document.querySelector('.applications .stat-value').textContent = data.pendingApplications;
        document.querySelector('.occupancy .stat-value').textContent = data.occupancyRate + '%';
      })
      .catch(error => console.error('Error updating stats:', error));
  }

  // Update recent activities
  function updateActivities() {
    fetch('/api/dashboard/activities')
      .then(response => response.json())
      .then(data => {
        const activityList = document.querySelector('.activity-list');
        // Clear existing activities
        activityList.innerHTML = '';
        
        // Add new activities
        data.activities.forEach(activity => {
          const activityHtml = `
            <div class="activity-item ${activity.type}">
              <div class="activity-icon">${activity.icon}</div>
              <div class="activity-details">
                <h4>${activity.description}</h4>
                <span class="timestamp">${activity.timestamp}</span>
              </div>
            </div>
          `;
          activityList.insertAdjacentHTML('beforeend', activityHtml);
        });
      })
      .catch(error => console.error('Error updating activities:', error));
  }

  // Initial updates
  updateStats();
  updateActivities();

  // Set up periodic updates
  setInterval(updateStats, 300000); // Update stats every 5 minutes
  setInterval(updateActivities, 60000); // Update activities every minute

  // Quick action handlers
  document.querySelectorAll('.action-card').forEach(card => {
    card.addEventListener('click', (e) => {
      const action = e.currentTarget.getAttribute('href').split('/').pop();
      console.log(`Quick action triggered: ${action}`);
    });
  });
});