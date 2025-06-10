const { insertHostel } = require('../models/Hostel');

(async () => {
  await insertHostel('Yoentenling', 'Male');
  await insertHostel('Norbuling', 'Female');
  console.log('✅ Hostels seeded');
})();
