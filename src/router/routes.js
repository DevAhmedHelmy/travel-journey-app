import { renderSearchView } from '../views/search.view.js';
import { renderResultsView } from '../views/results.view.js';
import { renderGenerateView } from '../views/generate.view.js';
import { renderSavedView } from '../views/saved-trips.view.js';
import { renderNotFoundView } from '../views/not-found.view.js';

export const routes = {
  '/': renderSearchView,
  '/search': renderSearchView,
  '/generate': renderGenerateView,
  '/results': renderResultsView,
  '/saved': renderSavedView,
};

export const notFoundRoute = renderNotFoundView;