// ../js/main.js
// Dashboard frontend-only employee CRUD (works without backend).
// Replaces previous main.js — uses event delegation and robust modal handling.

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const addEmployeeBtn = document.getElementById('addEmployeeBtn');
  const overlay = document.getElementById('overlay');
  const employeeModal = document.getElementById('employeeModal');
  const closeButtons = document.querySelectorAll('[data-close-button]');
  const employeeForm = document.getElementById('employeeForm');
  const employeeTableBody = document.getElementById('employeeTableBody');

  if (!employeeTableBody) return; // safety

  // Local storage key (for demo persistence)
  const STORAGE_KEY = 'ems_demo_employees';

  // initial sample data if nothing in storage
  let employees = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
  if (!Array.isArray(employees)) {
    employees = [
      { id: 1, first: 'John', last: 'Doe', email: 'john@example.com', position: 'Manager' },
      { id: 2, first: 'Jane', last: 'Smith', email: 'jane@example.com', position: 'Developer' }
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
  }

  // --------- Helpers ----------
  function saveEmployees() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
  }

  function openModal() {
    // reset form for "Add"
    employeeForm.reset();
    document.getElementById('empId').value = '';
    employeeModal.classList.add('active');
    overlay.classList.add('active');
    // focus first field for accessibility
    setTimeout(() => document.getElementById('empFirstName').focus(), 120);
  }

  function closeModal() {
    employeeModal.classList.remove('active');
    overlay.classList.remove('active');
  }

  function renderEmployees() {
    employeeTableBody.innerHTML = '';
    if (employees.length === 0) {
      employeeTableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:#9ca3af;padding:1.2rem">No employees yet</td></tr>`;
      return;
    }

    employees.forEach(emp => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${escapeHtml(emp.first)}</td>
        <td>${escapeHtml(emp.last)}</td>
        <td>${escapeHtml(emp.email)}</td>
        <td>${escapeHtml(emp.position)}</td>
        <td>
          <button class="small edit-btn" data-id="${emp.id}" title="Edit"><i class="fas fa-edit"></i></button>
          <button class="small danger delete-btn" data-id="${emp.id}" title="Delete"><i class="fas fa-trash"></i></button>
        </td>
      `;
      employeeTableBody.appendChild(tr);
    });
  }

  // simple text escape for safe innerHTML insertion
  function escapeHtml(str) {
    if (!str && str !== 0) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // --------- Event wiring ----------
  addEmployeeBtn.addEventListener('click', openModal);

  overlay.addEventListener('click', closeModal);
  closeButtons.forEach(btn => btn.addEventListener('click', closeModal));

  // close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // Form submit => add or update
  employeeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('empId').value;
    const first = document.getElementById('empFirstName').value.trim();
    const last = document.getElementById('empLastName').value.trim();
    const email = document.getElementById('empEmail').value.trim();
    const position = document.getElementById('empPosition').value.trim();

    // minimal validation
    if (!first || !last || !email || !position) {
      alert('Please fill in all fields.');
      return;
    }

    if (id) {
      // update
      const idx = employees.findIndex(e => String(e.id) === String(id));
      if (idx !== -1) {
        employees[idx] = { id: Number(id), first, last, email, position };
      }
    } else {
      // create
      const newEmp = { id: Date.now(), first, last, email, position };
      employees.push(newEmp);
    }

    saveEmployees();
    renderEmployees();
    closeModal();
  });

  // event delegation for edit/delete
  employeeTableBody.addEventListener('click', (e) => {
    const editBtn = e.target.closest('.edit-btn');
    const delBtn = e.target.closest('.delete-btn');

    if (editBtn) {
      const id = editBtn.dataset.id;
      const emp = employees.find(x => String(x.id) === String(id));
      if (!emp) return;
      document.getElementById('empId').value = emp.id;
      document.getElementById('empFirstName').value = emp.first;
      document.getElementById('empLastName').value = emp.last;
      document.getElementById('empEmail').value = emp.email;
      document.getElementById('empPosition').value = emp.position;
      openModal();
      return;
    }

    if (delBtn) {
      const id = delBtn.dataset.id;
      if (!confirm('Delete this employee?')) return;
      employees = employees.filter(x => String(x.id) !== String(id));
      saveEmployees();
      renderEmployees();
    }
  });

  // initial render
  renderEmployees();
});
