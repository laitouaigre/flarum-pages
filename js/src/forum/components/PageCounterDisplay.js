let pageNumberContainer = null;
let pageNumberInput = null;
let totalPagesSpan = null;
let isElementAdded = false;

// --- Getters ---
export function getPageNumberInput() {
    return pageNumberInput;
}
export function getTotalPagesSpan() {
    return totalPagesSpan;
}
export function isDisplayAdded() {
    return isElementAdded;
}
export function getContainer() {
    return pageNumberContainer;
}

// --- Updaters ---
export function updateDisplay(currentPage, totalPages) {
    if (!isElementAdded || !pageNumberInput || !totalPagesSpan) return;
    pageNumberInput.value = currentPage;
    pageNumberInput.min = 1;
    pageNumberInput.max = totalPages;
    totalPagesSpan.textContent = ` of ${totalPages}`;
    console.log(`Page counter display updated: Page ${currentPage} of ${totalPages}`);
}

// --- Removers ---
export function removeDisplay() {
    if (pageNumberContainer && pageNumberContainer.parentNode) {
      pageNumberContainer.parentNode.removeChild(pageNumberContainer);
    }
    pageNumberContainer = null;
    pageNumberInput = null;
    totalPagesSpan = null;
    isElementAdded = false;
    console.log("Page counter display elements removed.");
}

// --- Cleanup Listeners ---
export function removeInputListeners(handleInputSubmission, handleInputChange) {
    if (pageNumberInput) {
        pageNumberInput.removeEventListener('keydown', handleInputSubmission);
        pageNumberInput.removeEventListener('change', handleInputChange);
        // Remove focus/blur listeners if they were added as variables
        // pageNumberInput.removeEventListener('focus', onFocusHandler);
        // pageNumberInput.removeEventListener('blur', onBlurHandler);
    }
}

// --- Creators ---
export function createInteractiveElement(handleInputSubmission, handleInputChange) {
    if (isElementAdded) return; // Prevent re-creation

    pageNumberContainer = document.createElement('div');
    pageNumberContainer.className = 'flarum-page-counter-container';
    Object.assign(pageNumberContainer.style, {
        // --- Positioning ---
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: '9999',

        // --- Darker Glassmorphism Effect ---
        backgroundColor: '#1B2028', // <<<<<<<<< DARKER
        backdropFilter: 'blur(12px)',
        borderRadius: '16px',
        padding: '6px 8px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '15px',
        fontWeight: '600',
        color: 'white',
        transition: 'all 0.3s ease',
        opacity: '0.95',
    });

    // --- Hover Effects ---
    const handleMouseEnter = () => {
        pageNumberContainer.style.opacity = '1';
        pageNumberContainer.style.transform = 'translateY(-2px)';
        pageNumberContainer.style.boxShadow = '0 6px 24px rgba(0, 0, 0, 0.4)'; // <<<<<<<<< DARKER
    };
    const handleMouseLeave = () => {
        pageNumberContainer.style.opacity = '0.95';
        pageNumberContainer.style.transform = 'translateY(0)';
        pageNumberContainer.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)'; // <<<<<<<<< DARKER
    };
    pageNumberContainer.addEventListener('mouseenter', handleMouseEnter);
    pageNumberContainer.addEventListener('mouseleave', handleMouseLeave);

    // --- Store handlers for potential removal ---
    pageNumberContainer._pageCounterMouseEnterHandler = handleMouseEnter;
    pageNumberContainer._pageCounterMouseLeaveHandler = handleMouseLeave;

    pageNumberInput = document.createElement('input');
    pageNumberInput.className = 'flarum-page-counter-input';
    pageNumberInput.type = 'number';
    pageNumberInput.min = '1';
    pageNumberInput.max = '1';
    pageNumberInput.value = '1';
    Object.assign(pageNumberInput.style, {
        width: '40px',
        padding: '6px 8px',
        margin: '0',
        // --- Darker Input Style ---
        backgroundColor: '#212831', // <<<<<<<<< DARKER
        border: '1px solid rgba(255, 255, 255, 0.2)', // <<<<<<<<< DARKER
        borderRadius: '12px',
        color: 'white',
        fontSize: '15px',
        fontWeight: '600',
        textAlign: 'center',
        outline: 'none',
        flexShrink: 0,
        // Note: Hiding arrows via Object.assign style is complex for pseudo-elements.
        // This is handled by injecting CSS below or via a separate CSS file.
    });

    // --- Inject CSS to hide spinner arrows (once) ---
    const hideArrowsStyleId = 'flarum-page-counter-hide-arrows';
    if (!document.getElementById(hideArrowsStyleId)) {
        const hideArrowsStyle = document.createElement('style');
        hideArrowsStyle.id = hideArrowsStyleId;
        hideArrowsStyle.textContent = `
          .flarum-page-counter-input::-webkit-outer-spin-button,
          .flarum-page-counter-input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          .flarum-page-counter-input {
            -moz-appearance: textfield;
          }
        `;
        document.head.appendChild(hideArrowsStyle);
    }
    // --- End Inject CSS ---

    // --- Focus/Blur Effects ---
    const handleFocus = () => {
        pageNumberInput.style.border = '1px solid rgba(100, 150, 255, 0.8)'; // <<<<<<<<< BLUE FOCUS
        pageNumberInput.style.backgroundColor = 'rgba(60, 60, 60, 0.8)'; // <<<<<<<<< DARKER ON FOCUS
        pageNumberInput.style.boxShadow = '0 0 0 2px rgba(30, 100, 200, 0.3)'; // <<<<<<<<< GLOW
    };
    const handleBlur = () => {
        pageNumberInput.style.border = '1px solid rgba(255, 255, 255, 0.2)'; // <<<<<<<<< DARKER
        pageNumberInput.style.backgroundColor = 'rgba(50, 50, 50, 0.6)'; // <<<<<<<<< DARKER
        pageNumberInput.style.boxShadow = 'none';
    };
    pageNumberInput.addEventListener('focus', handleFocus);
    pageNumberInput.addEventListener('blur', handleBlur);

    // Store focus/blur handlers if needed for removal
    pageNumberInput._pageCounterFocusHandler = handleFocus;
    pageNumberInput._pageCounterBlurHandler = handleBlur;

    pageNumberInput.addEventListener('keydown', handleInputSubmission);
    pageNumberInput.addEventListener('change', handleInputChange);

    totalPagesSpan = document.createElement('span');
    totalPagesSpan.className = 'flarum-page-counter-total';
    totalPagesSpan.textContent = ' / ...';
    Object.assign(totalPagesSpan.style, {
        padding: '0 4px',
        userSelect: 'none',
        pointerEvents: 'none',
    });

    pageNumberContainer.appendChild(pageNumberInput);
    pageNumberContainer.appendChild(totalPagesSpan);
    document.body.appendChild(pageNumberContainer);
    isElementAdded = true;
}

export function createPlaceholderElement() {
    if (isElementAdded && pageNumberContainer) {
        pageNumberContainer.remove();
    }

    pageNumberContainer = document.createElement('div');
    pageNumberContainer.className = 'flarum-page-counter-container-placeholder';
    Object.assign(pageNumberContainer.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: '9999',
        // --- Darker Placeholder Style ---
        backgroundColor: 'rgba(40, 40, 40, 0.5)', // <<<<<<<<< DARKER
        border: '1px dashed rgba(100, 100, 100, 0.4)', // <<<<<<<<< DARKER
        borderRadius: '16px',
        padding: '6px 8px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '15px',
        fontWeight: '600',
        color: 'rgba(200, 200, 200, 0.7)', // <<<<<<<<< LIGHTER TEXT ON DARK
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)', // <<<<<<<<< DARKER
        transition: 'opacity 0.2s ease',
        opacity: '0.7',
        pointerEvents: 'none',
    });

    const placeholderInputPart = document.createElement('span');
    placeholderInputPart.className = 'page-counter-placeholder-part';
    placeholderInputPart.textContent = '...';
    Object.assign(placeholderInputPart.style, {
        padding: '6px 8px',
        margin: '0',
        backgroundColor: 'rgba(60, 60, 60, 0.4)', // <<<<<<<<< DARKER
        color: 'rgba(200, 200, 200, 0.7)', // <<<<<<<<< LIGHTER TEXT ON DARK
        borderRadius: '12px',
        fontSize: '15px',
        fontWeight: '600',
        userSelect: 'none',
    });

    const placeholderSeparatorTotalPart = document.createElement('span');
    placeholderSeparatorTotalPart.className = 'page-counter-placeholder-part';
    placeholderSeparatorTotalPart.textContent = ' / ...';
    Object.assign(placeholderSeparatorTotalPart.style, {
        padding: '0 4px',
        userSelect: 'none',
        pointerEvents: 'none',
    });

    pageNumberContainer.appendChild(placeholderInputPart);
    pageNumberContainer.appendChild(placeholderSeparatorTotalPart);
    document.body.appendChild(pageNumberContainer);
    isElementAdded = true; // Even if placeholder
    pageNumberInput = null;
    totalPagesSpan = null;
    console.log("Placeholder element created.");
}

// --- Enhanced Cleanup ---
export function removeAllListeners() {
    if (pageNumberContainer) {
        if (pageNumberContainer._pageCounterMouseEnterHandler) {
            pageNumberContainer.removeEventListener('mouseenter', pageNumberContainer._pageCounterMouseEnterHandler);
            delete pageNumberContainer._pageCounterMouseEnterHandler;
        }
        if (pageNumberContainer._pageCounterMouseLeaveHandler) {
            pageNumberContainer.removeEventListener('mouseleave', pageNumberContainer._pageCounterMouseLeaveHandler);
            delete pageNumberContainer._pageCounterMouseLeaveHandler;
        }
    }
    if (pageNumberInput) {
        if (pageNumberInput._pageCounterFocusHandler) {
            pageNumberInput.removeEventListener('focus', pageNumberInput._pageCounterFocusHandler);
            delete pageNumberInput._pageCounterFocusHandler;
        }
        if (pageNumberInput._pageCounterBlurHandler) {
            pageNumberInput.removeEventListener('blur', pageNumberInput._pageCounterBlurHandler);
            delete pageNumberInput._pageCounterBlurHandler;
        }
    }
    // Remove injected CSS for arrows if desired (optional, usually safe to leave)
    // const hideArrowsStyleId = 'flarum-page-counter-hide-arrows';
    // const styleTag = document.getElementById(hideArrowsStyleId);
    // if (styleTag) { styleTag.remove(); }
}

