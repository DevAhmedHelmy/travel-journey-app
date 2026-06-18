import { renderSearchView } from '../views/search.view.js';
import { renderResultsView } from '../views/results.view.js';
import { renderNotFoundView } from '../views/not-found.view.js';

export const routes = {
  '/': renderSearchView,
  '/search': renderSearchView,
  '/results': renderResultsView,
};

export const notFoundRoute = renderNotFoundView;