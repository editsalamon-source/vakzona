// Ékezetmentes, kötőjeles azonosító (URL-hez, horgonyhoz, szűrőhöz).
function slugify(text) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default slugify;
