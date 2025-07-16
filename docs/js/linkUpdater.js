// updateLinks.js

/**
 * Añade o actualiza el parámetro ?branch=xxx
 * en la URL de cada link-api.
 */
function applyBranchToLinks(branch) {
  const links = document.querySelectorAll('a.link-api');
  links.forEach(link => {
    const url = new URL(link.href, window.location.href);
    // Si es main y no había branch, podemos eliminar param:
    if (branch === 'main') {
      url.searchParams.delete('branch');
    } else {
      url.searchParams.set('branch', branch);
    }
    link.href = url.toString();
  });
}

// Al cargar la página, forzamos aplicar el default
window.addEventListener('DOMContentLoaded', () => {
  applyBranchToLinks('main');
});

// Cuando cambie el branch, lo aplicamos a todos
window.addEventListener('branchChanged', ev => {
  applyBranchToLinks(ev.detail.branch);
});
