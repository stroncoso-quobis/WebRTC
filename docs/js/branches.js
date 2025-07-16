// branches.js
const API_URL = 'https://api.github.com/repos/stroncoso-quobis/WebRTC/branches';
const selectEl = document.getElementById('branch-select');

// Carga ramas y las inyecta en el <select>
async function loadBranches() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`GitHub API status ${res.status}`);
    const branches = await res.json();

    // Opción inicial
    selectEl.innerHTML = '<option value="">(default) main</option>';

    // Rellenar
    branches.forEach(({ name }) => {
      const opt = document.createElement('option');
      opt.value = name;
      opt.textContent = name;
      selectEl.appendChild(opt);
    });
  } catch (err) {
    console.error('Error cargando branches:', err);
    selectEl.innerHTML = '<option value="">Error cargando ramas</option>';
  }
}

// Al cambiar la selección, lanzamos un evento custom con el branch
selectEl.addEventListener('change', () => {
  const branch = selectEl.value || 'main';
  window.dispatchEvent(new CustomEvent('branchChanged', {
    detail: { branch }
  }));
});

// Espera a DOM y arranca
document.addEventListener('DOMContentLoaded', loadBranches);
