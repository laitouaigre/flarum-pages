let totalPosts = 0;
let totalPages = 0;
let currentDiscussionId = null;

export function getTotalPosts() { return totalPosts; }
export function getTotalPages() { return totalPages; }
export function getCurrentDiscussionId() { return currentDiscussionId; }

export function setTotalPosts(posts) {
    totalPosts = posts;
    totalPages = Math.ceil(totalPosts / 20);
}
export function setCurrentDiscussionId(id) {
    currentDiscussionId = id;
}

export function resetState() {
    totalPosts = 0;
    totalPages = 0;
    currentDiscussionId = null;
}
