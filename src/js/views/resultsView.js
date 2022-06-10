/**LECTURE 297 - Implementing Search Results - Part 2 */

/**LECTURE 299 - Implementing Pagination - Part 2 */
import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'Recipe not found! (⊙_⊙;) Please try another!';
  _message = '';

  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResultsView();
