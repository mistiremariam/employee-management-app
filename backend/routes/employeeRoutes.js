const express = require('express');
const router = express.Router();
const {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} = require('../controllers/employeeController');

const { protect, admin } = require('../middlewares/authMiddleware');

// All routes are protected
router.route('/')
  .get(protect, getEmployees)        // GET all employees
  .post(protect, admin, createEmployee); // POST new employee (admin only)

router.route('/:id')
  .get(protect, getEmployee)         // GET single employee
  .put(protect, admin, updateEmployee)   // UPDATE employee (admin only)
  .delete(protect, admin, deleteEmployee); // DELETE employee (admin only)

module.exports = router;
