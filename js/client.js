/* --------------------------
   URL'DEN MÜŞTERİ ADINI AL
--------------------------- */
const params = new URLSearchParams(window.location.search);
const user = params.get("user") || "MÜŞTERİ";

// Başlık
document.getElementById("customerName").innerText =
    "Müşteri: " + user.toUpperCase();

/* --------------------------
   FOTOĞRAF LİSTELEME (GitHub Pages)
--------------------------- */
const photoGrid = document.getElementById("photoGrid");
let selectedPhotos = [];

async function loadPhotos() {
    try {
        // Fotoğraf klasörünün GitHub Pages URL'si
        const photosURL = `https://batuhanheval-bit.github.io/ozyildizpro-photos/photos/${user}/`;

        // GitHub API ile klasör listesini çekiyoruz
        const api = `https://api.github.com/repos/batuhanheval-bit/ozyildizpro-photos/contents/photos/${user}`;
        const res = await fetch(api);
        const list = await res.json();

        list.forEach(item => {
            if (item.name.match(/\.(jpg|jpeg|png)$/i)) {

                // FOTOĞRAF URL (GitHub Pages)
                const directURL = `${photosURL}${item.name}`;

                const img = document.createElement("img");
                img.src = directURL;
                img.className = "photoItem";

                img.onclick = () => toggleSelect(img, directURL);

                photoGrid.appendChild(img);
            }
        });

    } catch (e) {
        console.error("Foto listeleme hatası:", e);
        alert("📌 Fotoğraflar yüklenemedi! Klasör adını kontrol et.");
    }
}

loadPhotos();

/* --------------------------
   FOTOĞRAF SEÇ / KALDIR
--------------------------- */
function toggleSelect(img, url) {
    if (img.classList.contains("selected")) {
        img.classList.remove("selected");
        selectedPhotos = selectedPhotos.filter(x => x !== url);
    } else {
        img.classList.add("selected");
        selectedPhotos.push(url);
    }
}

/* --------------------------
   SEÇİMLERİ TAMAMLA
--------------------------- */
function finishSelection() {
    const box = document.getElementById("resultBox");
    const copyBtn = document.getElementById("copyBtn");

    // ÇOK satırlı temiz JSON format
    box.value = selectedPhotos.join("\n");

    box.style.display = "block";
    copyBtn.style.display = "inline-block";

    window.scrollTo(0, document.body.scrollHeight);
}

/* --------------------------
   SONUCU KOPYALA
--------------------------- */
function copyResult() {
    const box = document.getElementById("resultBox");
    navigator.clipboard.writeText(box.value);
    alert("📋 Kopyalandı!");
}
