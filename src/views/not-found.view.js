import { appHeader } from '../components/header.js';

export function renderNotFoundView() {
  const page = document.createElement('main');
  page.className = 'results-page py-3 py-md-4';

  page.innerHTML = `
    <div class="container" style="max-width: 680px;">
      <div class="card border-0 shadow-lg rounded-4">
        <div class="card-body p-3 p-md-4">

          ${appHeader()}

          <div class="not-found text-center rounded-4 py-5 px-3">
            <div class="not-found-code">404</div>
            <div class="not-found-icon mb-3">🧭</div>
            <h3 class="fw-bold mb-2">Page not found</h3>
            <p class="text-secondary mb-4 mx-auto" style="max-width: 420px;">
              Looks like you wandered off the map. The page you're looking for
              doesn't exist or may have moved.
            </p>
            <div class="d-flex gap-2 justify-content-center flex-wrap">
              <a href="/search" data-link class="btn btn-primary btn-lg px-4">✈️ Plan a trip</a>
              <a href="/saved" data-link class="btn btn-light btn-lg px-4">🧳 My Trips</a>
            </div>
          </div>

        </div>
      </div>
    </div>
  `;

  return page;
}
