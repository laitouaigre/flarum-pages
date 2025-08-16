import app from 'flarum/forum/app';

const POSTS_PER_PAGE = 20;

export function goToPage(pageNumber, totalPages, currentDiscussionId) {
    const targetPage = parseInt(pageNumber, 10);
    if (isNaN(targetPage) || targetPage < 1 || targetPage > totalPages) {
        alert(`Please enter a page number between 1 and ${totalPages}.`);
        // updateDisplay callback would be needed here, or trigger an event
        // For simplicity, we'll assume the calling function handles UI reset
        return;
    }

    const nearPostNumber = (targetPage - 1) * POSTS_PER_PAGE + 1;
    console.log(`Navigating to page ${targetPage}, near post ${nearPostNumber}`);

    if (!currentDiscussionId) {
        console.error("Cannot navigate: Current discussion ID unknown.");
        return;
    }

    const discussion = app.store.getById('discussions', currentDiscussionId);
    if (!discussion) {
         console.error("Cannot navigate: Discussion model not found in store.");
         return;
    }

    const url = app.route.discussion(discussion, nearPostNumber);
    console.log("Navigating to URL:", url);

    if (app.history && typeof app.history.pushState === 'function') {
        app.history.pushState(null, url);
    } else {
        window.location.assign(url);
    }
}
