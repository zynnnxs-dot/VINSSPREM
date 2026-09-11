// Ganti nomor ini dengan nomor WhatsApp tokomu (format: kode negara tanpa "+" atau "0" di depan)
const NOMOR_WHATSAPP = "6285715559734";

// ---------- App picker (klik ikon buat buka daftar paket) ----------

const tiles = Array.from(document.querySelectorAll(".picker__tile"));
const boards = Array.from(document.querySelectorAll(".board"));
const pickerHint = document.getElementById("pickerHint");

function closeAllBoards() {
  boards.forEach((board) => (board.hidden = true));
  tiles.forEach((tile) => {
    tile.classList.remove("is-active");
    tile.setAttribute("aria-expanded", "false");
  });
  pickerHint.hidden = false;
}

function openBoard(id, tile) {
  boards.forEach((board) => (board.hidden = board.id !== id));
  tiles.forEach((t) => {
    const isThis = t === tile;
    t.classList.toggle("is-active", isThis);
    t.setAttribute("aria-expanded", String(isThis));
  });
  pickerHint.hidden = true;

  const opened = document.getElementById(id);
  opened.scrollIntoView({ behavior: "smooth", block: "start" });
}

tiles.forEach((tile) => {
  tile.addEventListener("click", () => {
    const targetId = tile.dataset.target;
    const alreadyOpen = tile.classList.contains("is-active");
    alreadyOpen ? closeAllBoards() : openBoard(targetId, tile);
  });
});

document.querySelectorAll("[data-close]").forEach((btn) => {
  btn.addEventListener("click", closeAllBoards);
});

// ---------- Order summary ----------

const rows = Array.from(document.querySelectorAll(".row"));
const summaryCount = document.getElementById("summaryCount");
const summaryTotal = document.getElementById("summaryTotal");
const orderButton = document.getElementById("orderButton");

function formatRupiah(angka) {
  return "Rp" + angka.toLocaleString("id-ID");
}

function getSelectedItems() {
  return rows
    .filter((row) => row.querySelector(".row__check").checked)
    .map((row) => ({
      category: row.closest(".board__list").dataset.category,
      name: row.dataset.name,
      price: Number(row.dataset.price),
    }));
}

function updateSummary() {
  const selected = getSelectedItems();
  const total = selected.reduce((sum, item) => sum + item.price, 0);

  summaryCount.textContent =
    selected.length === 0
      ? "Belum ada item dipilih"
      : `${selected.length} item dipilih`;

  summaryTotal.textContent = formatRupiah(total);
  orderButton.disabled = selected.length === 0;
}

function buildWhatsAppMessage(selected) {
  const lines = selected.map(
    (item) => `- ${item.category} — ${item.name} (${formatRupiah(item.price)})`
  );
  const total = selected.reduce((sum, item) => sum + item.price, 0);

  return (
    "Halo, saya mau pesan:\n" +
    lines.join("\n") +
    `\n\nTotal: ${formatRupiah(total)}`
  );
}

rows.forEach((row) => {
  row.querySelector(".row__check").addEventListener("change", updateSummary);
});

orderButton.addEventListener("click", () => {
  const selected = getSelectedItems();
  if (selected.length === 0) return;

  const pesan = buildWhatsAppMessage(selected);
  const url = `https://wa.me/${NOMOR_WHATSAPP}?text=${encodeURIComponent(pesan)}`;
  window.open(url, "_blank");
});

updateSummary();
