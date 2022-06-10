import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
// import { async } from 'regenerator-runtime';
// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
/**LECTURE 288 - Loading a Recipe from API*/
/**LECTURE 289 - Rendering the Recipe */
/**LECTURE 292 - Refactoring for MVC */
/**LECTURE 293 - Helpers and Configuration Files */
/**LECTURE 294 - Event Handl;ers in MVC: Publisher-Subscriber Pattern */
/**LECTURE 300 - Project Planning 2 */
/**LECTURE 302 - Developing a DOM Updating Algorithm */
/**LECTURE 303 - Implementing Bookmarks - Part 1 */
/**LECTURE 306 - Project Planning 3 */

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return; //guard clause
    recipeView.renderSpinner();

    // 0) Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    // 1) updating bookmarks view
    bookmarksView.update(model.state.bookmarks);
    // 2) Loading Recipe
    // stores it into state object
    await model.loadRecipe(id);

    // 3) Render Recipe
    // the data from step one is passed into the render method
    recipeView.render(model.state.recipe);
    // stores it in recipeView.js _data
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

//responsible for rendering search results
const controlSearchResults = async function () {
  resultsView.renderSpinner();
  try {
    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) Load search results
    await model.loadSearchResults(query);

    // 3) Render results
    resultsView.render(model.getSearchResultsPage(1));

    //4) Render initial pagiantion buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // 3) Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  //4) Render NEW pagiantion buttons
  paginationView.render(model.state.search);
};

/**LECTURE 301 - Updating Recipe Servings */
const controlServings = function (newServings) {
  // Update recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1) add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //2) update recipe view
  recipeView.update(model.state.recipe);

  //3 Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};
const controlAddRecipe = async function (newRecipe) {
  try {
    //render laoding spinner
    addRecipeView.renderSpinner();

    //upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);
    //render recipe
    recipeView.render(model.state.recipe);

    //dipslay success message
    addRecipeView.renderMessage();

    // render bookmark view
    bookmarksView.render(model.state.bookmarks);

    //change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // window.history.back();

    //close form window
    setTimeout(function () {
      // add.recipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.log('💥', err);
    addRecipeView.renderError(err.message);
  }
  //upload the new recipe
};

const newFeature = function () {
  console.log('Welcome to the application!');
};

/**LECTURE 290 - Listening for load and hashchange Events  */
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addhandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  newFeature();
};
init();
/**LECTURE 291 - THE MVC Architecture */
/**
 * WHY WORRY ABOUT ARCHITECTURE?
 *  STRUCTURE
 *    Like a house software needs structure; the way we organize our code
 *
 *  MAINTAINABILITY
 *    A project is never done! We need to be able to easily change it in the future
 *
 *  EXPANDABILITY
 *    We need to be able to easily add new features
 *
 *  The perfect architecture combines all three of these. Which means we can create
 *    our own architecture (MAPTY PROJECT) or use a well established aritechture
 *    like MVC, MVP, Flux etc.(FORKIFY PROJECT)
 *
 *  We can use a framework like React, Angular, Vue, Svelte etc.
 *  Important to understand JS before using these frameworks.
 *
 *
 * COMPONENTS OF ANY ARCHITECTURE
 *  BUSINESS LOGIC
 *    Code that solves the actual business problem
 *    Directly related to what business does and what it needs
 *    Eg. sending messages, storing transactions, calculating taxes
 *
 *  STATE
 *    Essentially stores all the data about the application
 *    Should be the "single source of truth"
 *    UI should be kept in sync with the state
 *    State libraries exist (REDUX, MobX)
 *
 *  HTTP LIBRARY
 *    Responsible for making and receiving AJAX requests
 *    Optional but almost always nescessary in real-world apps
 *
 *  APPLICATION LOGIC(ROUTER)
 *    Code that is only concerned about the implementation of application itself
 *    Handles navigation and UI events
 *
 *  PRESENTATION LOGIC(UI LAYER)
 *    Code that is concerned about the visible part of the application
 *    Essentially displays application state
 *
 * THE MODEL-VIEW-CONTROLLER (MVC) ARCHITECTURE
 *  MODEL ---> Interacts with back-end/web APIs
 *    Business Logic
 *    State
 *    HTTP Library
 *
 *  CONTROLLER
 *    Application Logic
 *      Exists as the bridge between the MODEL and the VIEW
 *        to keep them independent of each other
 *      Handles UI events and dispatches tasks to model and view
 *
 *  VIEW ---> Interacts with the USER
 *    Presentation Logic
 *
 * Example:
 *  User clicks and the controller receives the click and asks the user for data
 *    while updating the UI
 */
