const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.site-nav ul');

hamburger.addEventListener('click', () => {
  navMenu.classList.toggle('show');
});
// ===== DASHBOARD & EMPLOYEES LOGIC =====

// Modal Handling
const openModalButtons = document.querySelectorAll('[data-modal-target]');
const closeModalButtons = document.querySelectorAll('[data-close-button]');
const overlay = document.getElementById('overlay');

openModalButtons.forEach(button => {
  button.addEventListener('click', () => {
    const modal = document.querySelector(button.dataset.modalTarget);
    openModal(modal);
  });
});

closeModalButtons.forEach(button => {
  button.addEventListener('click', () => {
    const modal = button.closest('.modal');
    closeModal(modal);
  });
});

overlay.addEventListener('click', () => {
  const modals = document.querySelectorAll('.modal.active');
  modals.forEach(modal => closeModal(modal));
});

function openModal(modal) {
  if (modal == null) return;
  modal.classList.add('active');
  overlay.classList.add('active');
}

function closeModal(modal) {
  if (modal == null) return;
  modal.classList.remove('active');
  overlay.classList.remove('active');
}

// ===== Employee CRUD Operations =====
async function fetchEmployees() {
  try {
    const res = await fetch('/api/employees', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    const employees = await res.json();
    populateEmployeeTable(employees);
  } catch (error) {
    console.error(error);
  }
}

function populateEmployeeTable(employees) {
  const tableBody = document.getElementById('employeeTableBody');
  tableBody.innerHTML = '';
  employees.forEach(emp => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${emp.firstName}</td>
      <td>${emp.lastName}</td>
      <td>${emp.email}</td>
      <td>${emp.position}</td>
      <td>
        <button class="btn primary" onclick="editEmployee('${emp._id}')">Edit</button>
        <button class="btn secondary" onclick="deleteEmployee('${emp._id}')">Delete</button>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

// ===== Edit Employee =====
async function editEmployee(id) {
  try {
    const res = await fetch(`/api/employees/${id}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    const emp = await res.json();
    // Populate modal fields
    document.getElementById('empId').value = emp._id;
    document.getElementById('empFirstName').value = emp.firstName;
    document.getElementById('empLastName').value = emp.lastName;
    document.getElementById('empEmail').value = emp.email;
    document.getElementById('empPosition').value = emp.position;
    openModal(document.getElementById('employeeModal'));
  } catch (error) {
    console.error(error);
  }
}

// ===== Delete Employee =====
async function deleteEmployee(id) {
  if (!confirm('Are you sure you want to delete this employee?')) return;

  try {
    const res = await fetch(`/api/employees/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });

    if (res.ok) {
      alert('Employee deleted successfully');
      fetchEmployees();
    } else {
      const data = await res.json();
      alert(data.message || 'Failed to delete employee');
    }
  } catch (error) {
    console.error(error);
  }
}

// ===== Save Employee (Add/Edit) =====
const employeeForm = document.getElementById('employeeForm');
if (employeeForm) {
  employeeForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('empId').value;
    const firstName = document.getElementById('empFirstName').value.trim();
    const lastName = document.getElementById('empLastName').value.trim();
    const email = document.getElementById('empEmail').value.trim();
    const position = document.getElementById('empPosition').value.trim();

    const payload = { firstName, lastName, email, position };

    try {
      const res = await fetch(id ? `/api/employees/${id}` : '/api/employees', {
        method: id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        alert(`Employee ${id ? 'updated' : 'added'} successfully`);
        fetchEmployees();
        closeModal(document.getElementById('employeeModal'));
      } else {
        alert(data.message || 'Failed to save employee');
      }
    } catch (error) {
      console.error(error);
    }
  });
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('employeeTableBody')) fetchEmployees();
});
