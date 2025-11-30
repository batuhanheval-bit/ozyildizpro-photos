// --- FOTOĞRAF SEÇME ve LİSTELEME ---
let photoList = [];

// Foto yükleme işlemi uploadPhotos.js içinde yapılır!
document.getElementById("photoUpload").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const url = await uploadPhoto(file);
  if (!url) return;

  photoList.push(url);
  updatePhotoList();
});

// --- LİSTEYİ EKRANA YAZDIR ---
function updatePhotoList() {
  const container = document.getElementById("photoList");
  container.innerHTML = "";

  photoList.forEach((url, index) => {
    const div = document.createElement("div");
    div.className = "photo-item";

    div.innerHTML = `
      <input type="checkbox" data-index="${index}">
      <img src="${url}" />
      <button onclick="removePhoto(${index})">Sil</button>
    `;

    container.appendChild(div);
  });
}

function removePhoto(i) {
  photoList.splice(i, 1);
  updatePhotoList();
}

// --- ZIP OLARAK İNDİR ---
document.getElementById("downloadZip").addEventListener("click", async () => {
  const zip = new JSZip();
  const selected = document.querySelectorAll('.photo-item input:checked');

  if (selected.length === 0) {
    alert("Hiç foto seçmedin kral.");
    return;
  }

  let folder = zip.folder("OzyildizPRO_fotolar");

  for (const item of selected) {
    const index = item.getAttribute("data-index");
    const url = photoList[index];

    const blob = await fetch(url).then(res => res.blob());
    folder.file(`foto_${index}.jpg`, blob);
  }

  const content = await zip.generateAsync({ type: "blob" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(content);
  link.download = "OzyildizPRO_Fotolar.zip";
  link.click();
});
