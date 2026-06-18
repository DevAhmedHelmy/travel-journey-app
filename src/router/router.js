import { routes, notFoundRoute } from './routes.js';

const appRoot = document.querySelector('#app');

export function navigateTo(path) {
  window.history.pushState({}, '', path);
  renderRoute();
}

export function renderRoute() {
  const path = window.location.pathname;
  const view = routes[path] || notFoundRoute;

  appRoot.innerHTML = '';
  appRoot.appendChild(view());
}

export function initRouter() {
  window.addEventListener('popstate', renderRoute);

  document.addEventListener('click', function (event) {
    const link = event.target.closest('[data-link]');

    if (!link) return;

    event.preventDefault();
    navigateTo(link.getAttribute('href'));
  });

  renderRoute();
}