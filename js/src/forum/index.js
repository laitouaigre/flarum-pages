import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import DiscussionPage from 'flarum/forum/components/DiscussionPage';

// Import your modules
import { getCurrentPostNumberFromPath } from './utils/urlUtils';
import * as PageCounterDisplay from './components/PageCounterDisplay';
import { goToPage } from './handlers/navigationHandler';
// Assuming event handlers are structured to accept dependencies or use imports
import * as EventHandlers from './handlers/eventHandlers';
// If using a state module
import * as PageCounterState from './state/pageCounterState';

app.initializers.add('laitouaigre-pagesd-page-counter', () => {
  let onScrollHandler = null; // Store reference to remove listener

  // --- Function to create/update the page counter UI and State ---
  function updatePageCounter(discussionPageComponent) {
    console.log("Attempting to update page counter (data check)...");
    const discussion = discussionPageComponent.discussion;

    if (!discussion) {
      console.log("Discussion model not available.");
      if (PageCounterDisplay.isDisplayAdded()) {
         PageCounterDisplay.removeAllListeners(); // Enhanced cleanup
         PageCounterDisplay.removeDisplay();
         if (onScrollHandler) {
            window.removeEventListener('scroll', onScrollHandler);
            onScrollHandler = null;
         }
         PageCounterState.resetState(); // If using state module
         console.log("Removed page counter display and listener.");
      }
      return;
    }

    // --- Update State (if using state module) ---
    const newTotalPosts = discussion.attribute('lastPostNumber');
    console.log("Total Posts (lastPostNumber) from model:", newTotalPosts);

    if (typeof newTotalPosts !== 'number' || newTotalPosts <= 0) {
       console.log("Invalid post count from model.");
       if (!PageCounterDisplay.isDisplayAdded()) {
           PageCounterDisplay.createPlaceholderElement(); // Handles dark style
       }
       PageCounterState.resetState(); // If using state module
       if (onScrollHandler) {
            window.removeEventListener('scroll', onScrollHandler);
            onScrollHandler = null;
       }
       return;
    }

    const oldTotalPosts = PageCounterState.getTotalPosts(); // If using state module
    const dataChanged = (newTotalPosts !== oldTotalPosts);
    if (dataChanged) {
        PageCounterState.setTotalPosts(newTotalPosts); // Updates totalPages too
        PageCounterState.setCurrentDiscussionId(discussion.id()); // If using state module
        console.log("Total Pages recalculated:", PageCounterState.getTotalPages()); // If using state module
    }

    // --- Create Display if needed ---
    if (!PageCounterDisplay.isDisplayAdded()) {
        // Create bound handlers or pass necessary functions/variables
        // Example: Pass state getters or navigation function
        const handleSubmission = function(e) {
             if (e.key === 'Enter') {
                 e.preventDefault();
                 const inputValue = PageCounterDisplay.getPageNumberInput().value; // Get live value
                 const totalPages = PageCounterState.getTotalPages();
                 const currentDiscussionId = PageCounterState.getCurrentDiscussionId();
                 if (totalPages > 0 && currentDiscussionId) {
                     goToPage(inputValue, totalPages, currentDiscussionId); // Use imported function
                 }
             }
        };
        const handleChange = function() {
             const inputValue = this.value; // 'this' is the input element
             const totalPages = PageCounterState.getTotalPages();
             const currentDiscussionId = PageCounterState.getCurrentDiscussionId();
             if (totalPages > 0 && currentDiscussionId) {
                 goToPage(inputValue, totalPages, currentDiscussionId); // Use imported function
             }
        };

        PageCounterDisplay.createInteractiveElement(handleSubmission, handleChange); // Handles dark style & arrows
        console.log("Interactive page counter display created.");

        // Create scroll handler, passing a function to get the current totalPages
        onScrollHandler = EventHandlers.createOnScrollHandler(() => PageCounterState.getTotalPages());
        window.addEventListener('scroll', onScrollHandler, { passive: true });
        console.log("Scroll listener attached.");

        setTimeout(() => {
             // Initial UI update
             const totalPages = PageCounterState.getTotalPages();
             if (totalPages > 0) {
                 const currentPostNumber = getCurrentPostNumberFromPath(); // Use imported function
                 const currentPage = Math.max(1, Math.min(totalPages, Math.ceil(currentPostNumber / 20)));
                 PageCounterDisplay.updateDisplay(currentPage, totalPages); // Use imported function
             }
        }, 100);

    } else if (dataChanged) {
         // Update display if data changed (e.g., post count updated)
         const totalPages = PageCounterState.getTotalPages();
         const currentPostNumber = getCurrentPostNumberFromPath(); // Use imported function
         const currentPage = Math.max(1, Math.min(totalPages, Math.ceil(currentPostNumber / 20)));
         PageCounterDisplay.updateDisplay(currentPage, totalPages); // Use imported function
    }
    // If element exists, scroll listener handles continuous updates
  }

  // --- Extend DiscussionPage ---
  extend(DiscussionPage.prototype, 'oncreate', function () {
    console.log("Page counter extension: oncreate triggered.");
    updatePageCounter(this);
  });

  extend(DiscussionPage.prototype, 'onupdate', function () {
    console.log("Page counter extension: onupdate triggered.");
    updatePageCounter(this);
  });

  extend(DiscussionPage.prototype, 'onremove', function () {
    console.log("Cleaning up page counter extension.");
    if (onScrollHandler) {
        window.removeEventListener('scroll', onScrollHandler);
        onScrollHandler = null;
    }
    // Remove all listeners attached to elements (focus, blur, hover, input events)
    PageCounterDisplay.removeAllListeners(); // Enhanced cleanup function

    // Remove display elements
    PageCounterDisplay.removeDisplay();

    // Reset state if using state module
    PageCounterState.resetState(); // If using state module

    console.log("Page counter extension cleaned up.");
  });

});
