
const pool = require('../config/db');

exports.renderDashboard = async (req, res) => {
    try {
        // Fetch total students from users table
        const totalStudentsResult = await pool.query('SELECT COUNT(*) FROM users');
        const totalStudents = totalStudentsResult.rows[0].count;

        // Fetch available rooms from rooms table using is_available boolean
        const availableRoomsResult = await pool.query("SELECT COUNT(*) FROM rooms WHERE is_available = true");
        const availableRooms = availableRoomsResult.rows[0].count;

        // Fetch pending applications from applications table
        const pendingAppsResult = await pool.query("SELECT COUNT(*) FROM applications WHERE status = 'pending'");
        const pendingApplications = pendingAppsResult.rows[0].count;

        // Example recent activities (this assumes you have an 'activities' table)
        const recentActivitiesResult = await pool.query(
            `SELECT action, user_name, timestamp 
       FROM activities 
       ORDER BY timestamp DESC 
       LIMIT 5`
        );
        const recentActivities = recentActivitiesResult.rows;

        res.render('dashboard', {
            totalStudents,
            availableRooms,
            pendingApplications,
            recentActivities,
            currentPage: 'dashboard'  // <-- add this
        });
    } catch (error) {
        console.error('Error rendering dashboard:', error);
        res.status(500).send('Server Error');
    }
};
