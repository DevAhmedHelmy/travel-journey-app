// Standard page card wrapper (container > card > card-body) used by every view.
export function pageCard(inner, { maxWidth = 680, bodyClass = 'p-3 p-md-4' } = {}) {
  return `
    <div class="container" style="max-width: ${maxWidth}px;">
      <div class="card border-0 shadow-lg rounded-4">
        <div class="card-body ${bodyClass}">
          ${inner}
        </div>
      </div>
    </div>
  `;
}
