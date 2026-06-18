export function renderResultsView() {
  const page = document.createElement('main');

  page.innerHTML = `
    <section class="page">
      <h1>Trip Results</h1>
      <p>Your generated travel plan will appear here.</p>

      <a href="/search" data-link class="btn btn-primary mt-3">
        Back to Search
      </a>
    </section>
  `;

  return page;
}