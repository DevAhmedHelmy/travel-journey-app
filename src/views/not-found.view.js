export function renderNotFoundView() {
  const page = document.createElement('main');

  page.innerHTML = `
    <section class="page">
      <h1>404</h1>
      <p>Page not found.</p>

      <a href="/search" data-link class="btn btn-primary mt-3">
        Back to Search
      </a>
    </section>
  `;

  return page;
}