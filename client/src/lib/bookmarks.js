const STORAGE_KEY = "politik-news-bookmarks";

function getAll() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function save(bookmarks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
}

export function getBookmarks() {
  return getAll();
}

export function addBookmark(article) {
  const bookmarks = getAll();
  if (bookmarks.some((b) => b.id === article.id)) return;
  bookmarks.unshift(article);
  save(bookmarks);
}

export function removeBookmark(articleId) {
  const bookmarks = getAll().filter((b) => b.id !== articleId);
  save(bookmarks);
}

export function isBookmarked(articleId) {
  return getAll().some((b) => b.id === articleId);
}
