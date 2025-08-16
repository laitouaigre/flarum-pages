/**
 * Gets the current post number from the Flarum discussion URL path.
 * Assumes standard Flarum URL format: /d/{id}-{slug}/{post_number}
 * If on the main discussion page without a specific post, it defaults to 1.
 * @returns {number} The current post number, or 1 if not found or invalid.
 */
export function getCurrentPostNumberFromPath() {
  try {
    const pathname = window.location.pathname;
    const parts = pathname.split('/').filter(part => part.length > 0); // Split and remove empty parts

    // Check if it looks like a discussion URL: [/]d/{id-slug}/{post_number}
    // parts[0] should be 'd'
    if (parts.length >= 2 && parts[0] === 'd') {
      // parts[1] is '{id}-{slug}'
      // parts[2] (if exists) should be the post number
      if (parts.length >= 3) {
        const postNumberStr = parts[2];
        const postNumber = parseInt(postNumberStr, 10);
        if (!isNaN(postNumber) && postNumber >= 1) {
          console.log("Current post number parsed from path:", postNumber);
          return postNumber;
        }
      } else {
        // On the main discussion page (e.g., /d/1-test), no specific post number.
        // Default to the first post.
        console.log("On main discussion page, defaulting post number to 1.");
        return 1;
      }
    }
    // If URL doesn't match the expected discussion format
    console.warn("Current URL does not match expected discussion format for post number:", pathname);
  } catch (error) {
    console.error("Error parsing post number from path:", error);
  }
  // Default fallback
  return 1;
}
