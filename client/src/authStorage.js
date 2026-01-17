export function getCurrentUser() {
  const raw = localStorage.getItem("currentUser");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setCurrentUser(user) {
  localStorage.setItem("currentUser", JSON.stringify(user));
}

export function clearCurrentUser() {
  localStorage.removeItem("currentUser");
}
