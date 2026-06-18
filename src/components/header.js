// Shared top bar used across the generate / results / saved pages.
// The user avatar is a Bootstrap dropdown with quick navigation.
export function appHeader() {
  return `
    <header class="d-flex align-items-center justify-content-between mb-4">
      <a href="/search" data-link class="text-decoration-none">
        <h2 class="fw-bold text-dark m-0">JourneyAI</h2>
      </a>

      <div class="d-flex align-items-center gap-2">
        <button class="btn btn-light rounded-circle" type="button" aria-label="Toggle theme">☾</button>

        <div class="dropdown">
          <button class="btn p-0 border-0 bg-transparent" type="button"
                  data-bs-toggle="dropdown" data-bs-display="static"
                  aria-expanded="false" aria-label="User menu">
            <span class="app-avatar">👤</span>
          </button>
          <ul class="dropdown-menu dropdown-menu-end shadow border-0 rounded-4 mt-2 p-2" style="min-width: 220px;">
            <li class="px-2 py-1">
              <div class="fw-semibold">Hi, Traveler 👋</div>
              <div class="text-secondary small">Welcome back</div>
            </li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item rounded-3 py-2" href="/saved" data-link>🧳 My Trips</a></li>
            <li><a class="dropdown-item rounded-3 py-2" href="/search" data-link>➕ Plan a new trip</a></li>
          </ul>
        </div>
      </div>
    </header>
  `;
}