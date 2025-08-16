import { goToPage } from './navigationHandler';
import { getCurrentPostNumberFromPath } from '../utils/urlUtils';
import { getTotalPages, getCurrentDiscussionId } from '../state/pageCounterState'; // Assume state module
import * as PageCounterDisplay from '../components/PageCounterDisplay';

let ticking = false;


export function createOnScrollHandler(getTotalPagesFn) { // Pass a getter function for totalPages
     return function onScroll() {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const totalPages = getTotalPagesFn(); // Use the passed getter
            if (totalPages > 0) {
                const currentPostNumber = getCurrentPostNumberFromPath();
                const currentPage = Math.max(1, Math.min(totalPages, Math.ceil(currentPostNumber / 20)));
                PageCounterDisplay.updateDisplay(currentPage, totalPages); // <<<<<<<<< CALL UPDATED FUNCTION
            }
            ticking = false;
          });
          ticking = true;
        }
     };
}
// ... rest of the file ...
// --- Input Handlers ---
function performNavigation(inputValue) {
     const totalPages = getTotalPages();
     const currentDiscussionId = getCurrentDiscussionId();
     if (totalPages > 0 && currentDiscussionId) {
         goToPage(inputValue, totalPages, currentDiscussionId);
     }
}

export function handleInputChange() {
     const input = this; // 'this' refers to the input element if listener is attached directly
     // Or get it from a global/state reference if needed
     const inputValue = input.value;
     performNavigation(inputValue);
}

export function handleInputSubmission(e) {
     if (e.key === 'Enter') {
         e.preventDefault();
         const input = e.target; // Get the input element that triggered the event
         const inputValue = input.value;
         performNavigation(inputValue);
     }
     // Optional: Add input validation here
}
